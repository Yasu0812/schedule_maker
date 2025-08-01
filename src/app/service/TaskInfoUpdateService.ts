import { UUID } from "../common/IdUtil";
import { TaskManager } from "../models/TaskManager";

export class TaskInfoUpdateService {

    public updateTaskName(
        taskId: UUID,
        taskManager: TaskManager,
        taskName: string,
    ): TaskManager {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }
        if (taskName.trim() === "") {
            throw new Error("Task name cannot be empty");
        }

        taskManager.updateTaskInformation(task.id, { ...task.taskInformation, taskName: taskName.trim() });

        return taskManager;
    }

    public updateTaskDescription(
        taskId: UUID,
        taskManager: TaskManager,
        description: string,
    ): TaskManager {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }
        if (description.trim() === "") {
            throw new Error("Task description cannot be empty");
        }

        taskManager.updateTaskInformation(task.id, { ...task.taskInformation, description: description.trim() });

        return taskManager;
    }

    public updatePremiseTaskIds(
        taskId: UUID,
        taskManager: TaskManager,
        premiseTaskIds: UUID[],
    ): TaskManager {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        taskManager.updateTaskInformation(task.id, { ...task.taskInformation, premiseTaskIds });

        return taskManager;
    }

    public updateGroupTaskId(
        taskId: UUID,
        taskManager: TaskManager,
        groupTaskId?: string,
    ): TaskManager {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        taskManager.updateTaskInformation(task.id, { ...task.taskInformation, groupTaskId });

        return taskManager;
    }
}   