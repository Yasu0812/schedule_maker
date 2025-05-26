import { CalendarCellTask } from "@/app/models/CalendarCellTask";
import { JellyBean } from "../decorator/JellyBean";
import { UUID } from "@/app/common/IdUtil";
import { DraggableDiv } from "../atom/DraggableDiv";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { TaskManager } from "@/app/models/TaskManager";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { parsePhase } from "@/app/common/PhaseEnum";


export default function TaskCell(
    props: {
        rowIndex: number,
        colIndex: number,
        task: CalendarCellTask | undefined,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        member: string,
    }
) {
    const { task, taskManager, planedTaskManager, setPlanedTaskManager, moveTargetTaskId, handleMoveTargetTask } = props;
    const { rowIndex, colIndex } = props;
    const className = `calendar-task-cell`;
    const thisCellTicketId = task ? taskManager.getTask(task.taskId)?.ticketId : undefined;

    const onMouseDown = (event: React.MouseEvent) => {
        //event.stopPropagation(); // クリックイベントが親要素に伝播しないようにする
        if (!task) return;

        handleMoveTargetTask(task?.taskId);

    }

    const onMouseUp = (event: React.MouseEvent) => {
        //event.stopPropagation(); // クリックイベントが親要素に伝播しないようにする

        console.log("mouse up", rowIndex, colIndex);
        const isSameTaskId = task?.taskId === moveTargetTaskId;
        if (isSameTaskId) {
            handleMoveTargetTask(undefined);
            return;
        }

        if (moveTargetTaskId) {
            const newPlanedTask = new TaskAssignmentService().assignTaskFromTaskId(
                moveTargetTaskId,
                props.member,
                colIndex,
                planedTaskManager,
                taskManager,
            );

            setPlanedTaskManager(newPlanedTask);
        }
        handleMoveTargetTask(undefined);
    }

    const onClick = (event: React.MouseEvent) => {
        //event.stopPropagation(); // クリックイベントが親要素に伝播しないようにする
        if (!task) return;

        handleMoveTargetTask(task.taskId);

    }

    const onContextMenu = (event: React.MouseEvent) => {
        event.preventDefault(); // 右クリックメニューを表示しないようにする
        if (!task) return;

        const assignedTaskId = planedTaskManager.get(task.taskId as UUID);
        if (assignedTaskId) {
            // すでに割り当てられているタスクを解除する
            const newPlanedTask = new TaskAssignmentService().disassignTask(
                assignedTaskId.id,
                planedTaskManager,
            );
            setPlanedTaskManager(
                newPlanedTask
            );
        }
        handleMoveTargetTask(undefined);

    }

    const isFinishedBeforePhase = (thisCellTicketId && task && new PlanningStatusService().isFinishedBeforePhaseWithDay(
        thisCellTicketId,
        parsePhase(task.taskPhase),
        taskManager,
        planedTaskManager,
        colIndex

    )) ? true : false;


    return (
        <div style={{ overflow: "hidden" }}
            className={className}
            onClick={onClick}
            onContextMenu={onContextMenu}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            <div style={{ width: "10%", height: "100%", position: "absolute", zIndex:1 }}></div>

            {task &&
                <DraggableDiv width={105} height={36} >
                    <JellyBean width={105} height={36} phase={task?.taskPhase} selected={moveTargetTaskId === task.taskId} >
                        &nbsp;{task?.taskName} {isFinishedBeforePhase ? "" : "❗️"}
                    </JellyBean>
                </DraggableDiv>
            }
            {!task && <>&nbsp;</>}
            <div style={{ width: "10%", height: "100%", position: "absolute", right: 0, zIndex:1 }}></div>

        </div>
    );
}
