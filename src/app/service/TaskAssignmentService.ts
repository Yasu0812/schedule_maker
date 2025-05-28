import { UUID } from "../common/IdUtil";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import { TaskManager } from "../models/TaskManager";

export class TaskAssignmentService {

    public assignTask(
        task: Task,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,

    ): PlanedTask {


        if (planedTask.isTaskAssingnable(memberId, task.id, startDay, task.duration)) {
            planedTask.assignTask(task, memberId, startDay, task.duration);
        }
        return planedTask;
    }

    public disassignTask(
        assignedId: UUID,
        planedTask: PlanedTask,
    ): PlanedTask {
        const assignedTask = planedTask.getFromAssignedId(assignedId);
        if (!assignedTask) {
            throw new Error(`Assigned task not found: ${assignedId}`);
        }
        planedTask.removeTask(assignedTask.taskId);

        return planedTask;
    }

    public assignTaskFromTaskId(
        taskId: UUID,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        return this.assignTask(task, memberId, startDay, planedTask);
    }

}
