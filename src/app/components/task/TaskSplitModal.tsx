import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketManager } from "@/app/models/Ticket";
import { TaskInfoUpdateService } from "@/app/service/TaskInfoUpdateService";
import { TaskMergeSplitService } from "@/app/service/TaskMergeSplitService";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { UUID } from "crypto";
import { useState } from "react";
import { JellyBean } from "../decorator/JellyBean";


const taskInfoUpdateService = new TaskInfoUpdateService();

export default function TaskSplitModal(props: {
    taskId: UUID,
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTaskManager: PlanedTask,
    setTaskManager: (taskManager: TaskManager) => void,
    hideModal: () => void;
}) {
    const task = props.taskManager.getTask(props.taskId);

    const [splitNum, setSplitNum] = useState<number>(1);

    const [splitDurationInput, setSplitDurationInput] = useState<string>("");

    const [splitDuration, setSplitDuration] = useState<number[]>([]);

    const [error, setError] = useState<string>("");

    const [inputName, setInputName] = useState<string>(task?.taskInformation?.taskName || "");

    const [inputDescription, setInputDescription] = useState<string>(task?.taskInformation?.description || "");

    const [inputPremiseTaskIds, setInputPremiseTaskIds] = useState<string>(task?.taskInformation?.premiseTaskIds?.join(", ") || "");

    const [premiseTaskIds, setPremiseTaskIds] = useState<UUID[]>(task?.taskInformation?.premiseTaskIds || []);

    const [inputGroupTaskId, setInputGroupTaskId] = useState<string>(task?.taskInformation?.groupTaskId || "");

    if (!task) {
        return <div>Task not found</div>;
    }

    const unassignedTasks = new UnassignedTaskService().getUnassignedTasks(
        props.taskManager,
        props.planedTaskManager,
        {
            phase: [task.phase],
            title: ''
        },
        task.ticketId,
        props.ticketManager.getExclusiveTicketIds(),
    );

    const unassignedTasksDuration = unassignedTasks.reduce((acc, t) => acc + t.duration, 0);

    const handleSplitNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setSplitNum(value);
            const durations = new TaskMergeSplitService().splitTaskByNumDurations(task.duration, value);
            setSplitDuration(durations);
            setSplitDurationInput(durations.join(", "));
            setError("");
        } else {
            setSplitNum(0);
            setSplitDuration([]);
            setSplitDurationInput("");
            setError("Please enter a valid number greater than 0.");
        }
    };

    const handleSpritDurationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setSplitDurationInput(input);
        const durations = input.split(/[,\s|]+/).filter(v => v.trim() !== "").map(v => parseInt(v)).filter(v => !isNaN(v) && v > 0);
        setSplitDuration(durations);
    }

    const handleSplitPremiseTaskIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setInputPremiseTaskIds(input);
        const ids = input.split(/[,\s|]+/).map(id => id.trim()).filter(id => id !== "");
        setPremiseTaskIds(ids as UUID[]);
    }

    const doSplit = () => {
        if (splitDuration.length > 0) {
            const newTaskManager = new TaskMergeSplitService().splitTaskDuration(
                props.taskId,
                props.taskManager,
                splitDuration
            );
            props.setTaskManager(newTaskManager);
            props.hideModal();

        } else {
            setError("Please specify either split durations or number of splits.");
        }
        setSplitNum(0);
        setSplitDuration([]);
        setSplitDurationInput("");
    };

    const resetSplit = () => {
        const newTaskManager = new TaskMergeSplitService().mergeTasks(
            unassignedTasks.map(t => t.id),
            props.taskManager
        );
        props.setTaskManager(newTaskManager);
        props.hideModal();
    };

    const updateTaskName = () => {
        if (inputName.trim() === "") {
            return;
        }
        const updatedTaskManager = taskInfoUpdateService.updateTaskName(
            props.taskId,
            props.taskManager,
            inputName.trim()
        );

        props.setTaskManager(updatedTaskManager);
    };

    const updateTaskDescription = () => {
        if (inputDescription.trim() === "") {
            return;
        }
        const updatedTaskManager = taskInfoUpdateService.updateTaskDescription(
            props.taskId,
            props.taskManager,
            inputDescription.trim()
        );

        props.setTaskManager(updatedTaskManager);
    };




    return (
        <div className="p-2" >
            <JellyBean width={150} height={36} phase={task.phase} selected={false}>{task.ticketTitle}</JellyBean>

            <h3 className="text-lg font-semibold mb-2">Task Setting</h3>
            <p className="mb-2">Task ID: {task.id}</p>
            <p className="mb-2">Task Name:</p>
            <input
                type="text"
                placeholder="Enter task name"
                className="border rounded p-2 mb-4 mr-2"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onBlur={updateTaskName}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        updateTaskName();
                    }
                }}
            />
            <p className="mb-2">Task Description:</p>
            <textarea
                placeholder="Enter task description"
                className="border rounded p-2 mb-4 mr-2 w-full"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                onBlur={updateTaskDescription}
            />
            <p className="mb-2">Premise Task IDs (comma separated):</p>
            <input
                type="text"
                placeholder="Enter premise task IDs"
                className="border rounded p-2 mb-4 mr-2 w-full"
                value={inputPremiseTaskIds}
                onChange={handleSplitPremiseTaskIdsChange}
                onBlur={() => {
                    const updatedTaskManager = taskInfoUpdateService.updatePremiseTaskIds(
                        props.taskId,
                        props.taskManager,
                        premiseTaskIds
                    );
                    props.setTaskManager(updatedTaskManager);
                }}
            />
            <p className="mb-2">Group Task ID:</p>
            <input
                type="text"
                placeholder="Enter group task ID"
                className="border rounded p-2 mb-4 mr-2 w-full"
                value={inputGroupTaskId}
                onChange={(e) => setInputGroupTaskId(e.target.value)}
                onBlur={() => {
                    const updatedTaskManager = taskInfoUpdateService.updateGroupTaskId(
                        props.taskId,
                        props.taskManager,
                        inputGroupTaskId
                    );
                    props.setTaskManager(updatedTaskManager);
                }}
            />
            <h3 className="text-lg font-semibold mb-2">Task Split</h3>
            <p className="mb-2">Unassigned Days Sum:{unassignedTasksDuration} days</p>
            <p className="mb-2">Task Duration: {task.duration} days</p>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="number"
                placeholder="Enter duration to split"
                className="border rounded p-2 mb-4 mr-2"
                value={splitNum}
                onChange={handleSplitNumChange}
            />
            <input
                type="text"
                placeholder="Enter split durations (comma separated)"
                className="border rounded p-2 mb-4 mr-2"
                value={splitDurationInput}
                onChange={handleSpritDurationInputChange}
            />
            <button
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
                onClick={doSplit}
            >
                Split Task
            </button>
            <button
                className="bg-red-500 text-white rounded p-2 hover:bg-red-600 ml-2"
                onClick={resetSplit}
            >
                Reset Split
            </button>
        </div>
    );
}