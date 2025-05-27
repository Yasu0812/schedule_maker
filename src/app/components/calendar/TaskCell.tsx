import { CalendarCellTask } from "@/app/models/CalendarCellTask";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { TaskManager } from "@/app/models/TaskManager";


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
    const { taskManager, planedTaskManager, setPlanedTaskManager, moveTargetTaskId, handleMoveTargetTask } = props;
    const { colIndex } = props;
    const className = `calendar-task-cell`;


    const onMouseUp = () => {
        console.log("onMouseUp", props.rowIndex, colIndex, moveTargetTaskId);
        const planedTask = planedTaskManager.get(moveTargetTaskId);

        if (planedTask?.memberId === props.member && (planedTask?.startDayNum <= colIndex && planedTask?.endDayNum >= colIndex)) {
            handleMoveTargetTask(moveTargetTaskId);
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

    return (
        <div style={{ overflow: "visible" }}
            className={className}
            onMouseUp={onMouseUp}
        >
            &nbsp;
        </div>
    );
}
