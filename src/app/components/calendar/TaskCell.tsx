import { CalendarCellTask } from "@/app/models/CalendarCellTask";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { TaskManager } from "@/app/models/TaskManager";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { parsePhase } from "@/app/common/PhaseEnum";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { memo } from "react";

interface TaskAssignmentProps {
    task: CalendarCellTask | undefined;
    taskManager: TaskManager;
    planedTaskManager: PlanedTask;
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void;
    moveTargetTaskId: UUID | undefined;
    handleMoveTargetTask: (taskId: UUID | undefined) => void;
    memberId: UUID;
    startDay: Date;
}

const TaskCell = memo(
    function TaskCell(
        props: TaskAssignmentProps
    ) {
        const {
            task,
            taskManager,
            planedTaskManager,
            setPlanedTaskManager,
            moveTargetTaskId,
            handleMoveTargetTask,
            memberId,
            startDay,
        } = props;
        const className = `calendar-task-cell`;
        const assignedTask = planedTaskManager.get(task?.taskId);


        const onMouseUp = () => {
            const planedTask = planedTaskManager.get(moveTargetTaskId);

            if (planedTask?.memberId === memberId && (planedTask?.startDay <= startDay && planedTask?.endDay >= startDay)) {
                handleMoveTargetTask(moveTargetTaskId);
                return;
            }

            if (moveTargetTaskId) {
                const newPlanedTask = new TaskAssignmentService().assignTaskFromTaskId(
                    moveTargetTaskId,
                    memberId,
                    startDay,
                    planedTaskManager,
                    taskManager,
                );

                setPlanedTaskManager(newPlanedTask);
            }
            handleMoveTargetTask(undefined);
        }

        const isFinishedBeforePhase = (assignedTask && task && new PlanningStatusService().isFinishedBeforePhaseWithDay(
            assignedTask.ticketId,
            parsePhase(task.taskPhase),
            taskManager,
            planedTaskManager,
            startDay

        )) ? true : false;

        const disAssignTask = (taskId: UUID) => {
            const assignedTaskId = planedTaskManager.get(taskId);
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
        }

        return (
            <div style={{ overflow: "visible" }}
                className={className}
                onMouseUp={onMouseUp}
            >
                {task &&
                    <TaskBeanDiv task={{
                        taskId: task.taskId,
                        taskName: task.taskName,
                        taskPhase: task.taskPhase,
                    }} duration={1} moveTargetTaskId={moveTargetTaskId}
                        handleMouseDown={() => handleMoveTargetTask(task.taskId)}
                        handleContextMenu={() => disAssignTask(task.taskId)}
                        isFinishedBeforePhase={!isFinishedBeforePhase}

                    />
                }
                {!task && <>&nbsp;</>}
            </div>
        );
    }
    , () => {
        return (
            // prevProps.task?.taskId === nextProps.task?.taskId &&
            // prevProps.moveTargetTaskId === nextProps.moveTargetTaskId &&
            // prevProps.memberId === nextProps.memberId &&
            // prevProps.startDay.getTime() === nextProps.startDay.getTime() &&
            // prevProps.planedTaskManager.get(prevProps.task?.taskId)?.id === nextProps.planedTaskManager.get(nextProps.task?.taskId)?.id
            false // TODO: ここを修正して、必要な条件で再レンダリングを制御する
        );
    })

export default TaskCell;