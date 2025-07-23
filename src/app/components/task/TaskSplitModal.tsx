import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketManager } from "@/app/models/Ticket";
import { TaskMergeSplitService } from "@/app/service/TaskMergeSplitService";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { UUID } from "crypto";
import { useState } from "react";


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


    return (
        <div className="p-4" >
            <h3 className="text-lg font-semibold mb-2">Task Split</h3>
            <p className="mb-2">Ticket Title: {task.ticketTitle}</p>
            <p className="mb-2">Unassigned Days Sum:{unassignedTasksDuration} days</p>
            <p className="mb-2">Task Duration: {task.duration} days</p>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="number"
                placeholder="Enter duration to split"
                className="border rounded p-2 mb-4 w-full"
                value={splitNum}
                onChange={handleSplitNumChange}
            />
            <input
                type="text"
                placeholder="Enter split durations (comma separated)"
                className="border rounded p-2 mb-4 w-full"
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
            <button
                className="bg-gray-300 text-black rounded p-2 hover:bg-gray-400 ml-2"
                onClick={props.hideModal}
            >
                Cancel
            </button>
        </div>
    );
}