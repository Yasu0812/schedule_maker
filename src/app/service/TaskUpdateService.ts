import { UUID } from "../common/IdUtil";
import { Task } from "../models/Task";
import { TaskManager } from "../models/TaskManager";
import { Ticket } from "../models/Ticket";

export class TaskUpdateService {

    public newTaskManager(tikcetList: Ticket[]): TaskManager {
        const taskManager = TaskManager.TaskManagerFactory(tikcetList);
        return taskManager;
    }

    public taskAdd(task: Task, taskManager: TaskManager): TaskManager {
        taskManager.addTask(task);
        return taskManager;
    }

    public taskRemove(taskId: UUID, taskManager: TaskManager): TaskManager {
        taskManager.removeTask(taskId);
        return taskManager;
    }
}   