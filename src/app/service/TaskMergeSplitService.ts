import { UUID } from "../common/IdUtil";
import { TaskManager } from "../models/TaskManager";
import { TaskMergeSplitter } from "../models/TaskMergeSplitter";

export class TaskMergeSplitService {

    public splitTaskHalf(taskId: UUID, taskManager: TaskManager): TaskManager {
        const task = taskManager.getTask(taskId);

        if (!task) {
            console.error(`Task with ID ${taskId} not found`);
            return taskManager;
        }

        const splitTasks = new TaskMergeSplitter().splitTaskByHalf(task);
        const newTaskManager = taskManager.addTaskList(splitTasks);

        return newTaskManager;
    }


    public mergeTasks(taskIds: UUID[], taskManager: TaskManager): TaskManager {
        const tasks = taskIds.map(id => taskManager.getTask(id)).filter(task => task !== undefined);

        try {
            const mergedTask = new TaskMergeSplitter().mergeTasks(tasks);
            const newTaskManager = taskManager.removeTasks(taskIds).addTask(mergedTask);
            return newTaskManager;

        } catch (error) {
            console.error("Error merging tasks:", error);
            return taskManager; // エラーが発生した場合は元のTaskManagerを返す
        }

    }

}