import { UUID } from "../common/IdUtil";
import { AssignedTask } from "./AssignedTask";
import DurationDayCalc from "./DurationDayCalc";
import { PlanedTask } from "./PlanedTask";
import { ScheduleConfiguration } from "./ScheduleConfiguration";
import { TaskManager } from "./TaskManager";


export default class TaskUpdateApplier {

    private _durationDayCalc = new DurationDayCalc();

    /**
     * taskが更新された時に、PlanedTaskの整合性を取る。
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public updateApply(
        taskManager: TaskManager,
        planedTask: PlanedTask,
        scheduleConfiguration: ScheduleConfiguration
    ): PlanedTask {
        const assignedTasks = planedTask.getList(taskManager.getTaskIds());
        const newPlanedTask = new PlanedTask(new Map<UUID, AssignedTask>());
        assignedTasks.forEach(assignedTask => {
            const task = taskManager.getTask(assignedTask.taskId);
            if (!task) {
                // タスクが存在しない場合は、割り当てを削除
                planedTask.removeTask(assignedTask.taskId);
            } else {
                const endDay = this._durationDayCalc.getEndDate(
                    assignedTask.startDay,
                    task.duration,
                    scheduleConfiguration.additionalHolidays,
                );

                newPlanedTask.assignTask(
                    { id: task.id, ticketId: task.ticketId },
                    assignedTask.memberId,
                    assignedTask.startDay,
                    endDay
                );
            }
        });

        return newPlanedTask;
    }
}