import { UUID } from "../common/IdUtil";
import { AssignedTask } from "./AssignedTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";


export default class TaskUpdateApplier {

    public updateApply(
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): PlanedTask {
        const assignedTasks = planedTask.getList(taskManager.getTaskIds());
        const newPlanedTask = new PlanedTask(new Map<UUID, AssignedTask>());
        assignedTasks.forEach(assignedTask => {
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