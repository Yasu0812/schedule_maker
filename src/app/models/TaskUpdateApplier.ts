import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";


export default class TaskUpdateApplier {

    public updateApply(
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): PlanedTask {
        const taskList = planedTask.getList(taskManager.getTaskIds());
        const newPlanedTask = new PlanedTask();
        taskList.forEach(assignedTask => {
            const task = taskManager.getTask(assignedTask.taskId);

            if (!task) {
                // タスクが存在しない場合は、割り当てを削除
                planedTask.removeTask(assignedTask.taskId);
            } else {
                newPlanedTask.assignTask(
                    { id: task.id, ticketId: task.ticketId },
                    assignedTask.memberId,
                    assignedTask.startDay,
                    task.duration
                );
            }
        });

        return newPlanedTask;
    }
}