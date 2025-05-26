import { UUID } from "../common/IdUtil";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import { TaskManager } from "../models/TaskManager";

export class TaskAssignmentService {


    public assignTask(
        task: Task,
        memberId: string,
        startDayNum: number,
        planedTask: PlanedTask,

    ): PlanedTask {

        if (planedTask.isTaskAssingnable(memberId, task.id, startDayNum, startDayNum + task.duration - 1)) {
            planedTask.assignTask(task, memberId, startDayNum);
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
        startDayNum: number,
        planedTask: PlanedTask,
        taskManager: TaskManager
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        return this.assignTask(task, memberId, startDayNum, planedTask);
    }

}
