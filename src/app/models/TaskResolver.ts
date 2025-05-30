import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { AssignedTask } from "./AssignedTask";
import { PlanedTask } from "./PlanedTask";
import { Task } from "./Task";
import { TaskManager } from "./TaskManager";

export class TaskResolver {

    /**
     * タスクIDからTaskとAssignedTaskを解決する
     * @param taskId 
     * @param taskManager 
     * @param planedTask 
     * @returns 同一のタスクIDを持つTaskとAssignedTaskのペア
     * @throws {Error} タスクが見つからない場合、または割り当てられたタスクが見つからない場合
     */
    public resolveTaskAndAssigned(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { task: Task, assignedTask: AssignedTask } {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const assignedTask = planedTask.get(task.id);
        if (!assignedTask) {
            throw new Error(`AssignedTask with ID ${task.id} not found`);
        }

        return { task, assignedTask };
    }

    public resolveAssignedTaskWithPhase(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { assignedTask: AssignedTask, phase: PhaseEnum } {
        const { task, assignedTask } = this.resolveTaskAndAssigned(taskId, taskManager, planedTask);
        return { assignedTask, phase: task.phase };
    }


    public resolveAssignedTaskPhase(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): PhaseEnum {
        const { task } = this.resolveTaskAndAssigned(taskId, taskManager, planedTask);
        return task.phase;
    }
}