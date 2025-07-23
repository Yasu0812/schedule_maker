import { CalendarCellTask } from "@/app/models/CalendarCellTask";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { TaskManager } from "@/app/models/TaskManager";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { memo } from "react";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";

let clickStartTime = 0;

const THRESHOLD_CLICK_TIME = 200; // ミリ秒

interface TaskAssignmentProps {
    task: CalendarCellTask | undefined;
    taskManager: TaskManager;
    planedTaskManager: PlanedTask;
    scheduleConfiguration: ScheduleConfiguration;
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void;
    moveTargetTaskId: UUID | undefined;
    handleMoveTargetTask: (taskId: UUID | undefined) => void;
    memberId: UUID;
    startDay: Date;
    isEnabled: boolean;
    isFiltered: boolean;
}

const TaskCell = memo(
    function TaskCell(
        props: TaskAssignmentProps
    ) {
        const {
            task,
            taskManager,
            planedTaskManager,
            scheduleConfiguration,
            setPlanedTaskManager,
            moveTargetTaskId,
            handleMoveTargetTask,
            memberId,
            startDay,
            isEnabled,
            isFiltered
        } = props;
        const className = `calendar-task-cell h-full ${isEnabled ? '' : 'disabled'}`;

        const onMouseUp = (e: React.MouseEvent) => {
            if (e.button !== 0) return; // 左クリック以外は無視

            const clickEndTime = Date.now();

            // クリック時間が短い場合は、タスクの移動をキャンセルする
            if (clickEndTime - clickStartTime < THRESHOLD_CLICK_TIME) {
                return;
            }

            if (moveTargetTaskId) {
                const newPlanedTask = new TaskAssignmentService().assignTaskFromTaskId(
                    moveTargetTaskId,
                    memberId,
                    startDay,
                    planedTaskManager,
                    taskManager,
                    scheduleConfiguration,
                );

                setPlanedTaskManager(newPlanedTask);
            }
            handleMoveTargetTask(undefined);
        }

        const onMouseDown = (e: React.MouseEvent) => {
            if (!task || e.button !== 0 || moveTargetTaskId === task.taskId) return;
            clickStartTime = Date.now();
            handleMoveTargetTask(task?.taskId);
        }

        const onContextMenu = (e: React.MouseEvent) => {
            e.preventDefault();
            const assignedTaskId = planedTaskManager.get(task?.taskId);
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
        };

        return (
            <div style={{ overflow: "visible" }}
                className={className}
                onMouseUp={onMouseUp}
                onMouseDown={onMouseDown}
                onContextMenu={onContextMenu}
            >
                {task &&
                    <TaskBeanDiv task={{
                        taskId: task.taskId,
                        taskName: task.taskName,
                        taskPhase: task.taskPhase,
                    }} duration={1} moveTargetTaskId={moveTargetTaskId}
                        isTaskAssignableDay={task.isTaskAssignableDay}
                        isFiltered={isFiltered}

                    />
                }
                {!task && <>&nbsp;</>}
            </div>
        );
    }
    , (prevProps, nextProps) => {
        return (
            prevProps.task?.taskId === nextProps.task?.taskId &&
            prevProps.task?.taskName === nextProps.task?.taskName &&
            prevProps.task?.isTaskAssignableDay.isAssignable === nextProps.task?.isTaskAssignableDay.isAssignable &&
            prevProps.moveTargetTaskId === nextProps.moveTargetTaskId &&
            prevProps.memberId === nextProps.memberId &&
            prevProps.startDay.getTime() === nextProps.startDay.getTime() &&
            prevProps.planedTaskManager.get(prevProps.task?.taskId)?.id === nextProps.planedTaskManager.get(nextProps.task?.taskId)?.id &&
            prevProps.isEnabled === nextProps.isEnabled &&
            prevProps.isFiltered === nextProps.isFiltered
        );
    })

export default TaskCell;