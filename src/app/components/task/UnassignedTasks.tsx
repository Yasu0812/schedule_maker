import { Task } from "@/app/models/Task";
import { TaskMergeSplitService } from "@/app/service/TaskMergeSplitService";
import { UUID } from "crypto";
import { DraggableDiv } from "../atom/DraggableDiv";
import { JellyBean } from "../decorator/JellyBean";
import { TaskManager } from "@/app/models/TaskManager";
import { phaseCompare } from "@/app/common/PhaseEnum";

export default function UnassignedTasks(
    props: {
        unassignedTasks: Task[],
        taskManager: TaskManager,
        moveTargetTaskId: UUID | undefined,
        setTaskManager: (taskManager: TaskManager) => void,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {
    const { unassignedTasks, taskManager, moveTargetTaskId, setTaskManager, handleMoveTargetTask } = props;

    const sortedUnassignedTasks = unassignedTasks
        .sort((a, b) => a.duration - b.duration)
        .sort((a, b) => phaseCompare(a.phase, b.phase))
        .sort((a, b) => Number(a.tickeTitle) - Number(b.tickeTitle))
        ;

    const onDoubleClick = (taskId: UUID, clientX: number, clientY: number) => {
        const newTaskManager = new TaskMergeSplitService().splitTaskHalf(taskId, taskManager);
        console.log("onDoubleClick", taskId, clientX, clientY);
        props.setTaskManager(newTaskManager);
        handleMoveTargetTask(taskId);
    }

    const onMouseUp = (e: React.MouseEvent, taskId: UUID) => {
        if (!moveTargetTaskId) {
            console.warn("No move target task ID set.");
            return;
        }

        if (taskId === moveTargetTaskId) {
            handleMoveTargetTask(taskId);
            return;
        }

        const newTaskManager = new TaskMergeSplitService().mergeTasks([taskId, moveTargetTaskId], taskManager);
        setTaskManager(newTaskManager);

    }

    const isSameTaskId = (taskId: UUID) => {
        return taskId === moveTargetTaskId;
    }

    const unassignedTaskBoxes = sortedUnassignedTasks.map((task) => {

        return (
            <div
                onMouseDown={() => handleMoveTargetTask(task.id)}
                key={task.id}
                style={{ margin: "5px" }}
                onDoubleClick={(e) => onDoubleClick(task.id, e.clientX, e.clientY)}
                onMouseUp={(e) => onMouseUp(e, task.id)}
            >
                <DraggableDiv width={100 * task.duration} height={38} >
                    <JellyBean width={100 * task.duration} height={38} phase={task.phase} selected={isSameTaskId(task.id)} >
                        {task.tickeTitle}
                    </JellyBean >
                </DraggableDiv>
            </div>

        );
    });


    return (
        <>{unassignedTaskBoxes}</>
    );
}