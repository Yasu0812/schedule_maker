import { UUID } from "../common/IdUtil";
import { ManagedTaskMerger } from "../models/ManagedTaskMerger";
import { TaskManager } from "../models/TaskManager";
import { TaskMergeSplitter } from "../models/TaskMergeSplitter";

export class TaskMergeSplitService {

    private _managedTaskMerger: ManagedTaskMerger = new ManagedTaskMerger();

    public splitTaskLeftDuration(taskId: UUID, taskManager: TaskManager, leftDuration: number): TaskManager {
        const task = taskManager.getTask(taskId);
        if (!task) {
            console.error(`Task with ID ${taskId} not found`);
            return taskManager;
        }
        const rightDuration = task.duration - leftDuration;
        if (rightDuration <= 0) {
            console.error(`Left duration must be less than the task's duration. Task ID: ${taskId}, Left Duration: ${leftDuration}, Task Duration: ${task.duration}`);
            return taskManager;
        }
        const splitTasks = new TaskMergeSplitter().splitTask(task, [leftDuration, rightDuration]);
        const newTaskManager = taskManager.removeTask(taskId).addTaskList(splitTasks);
        return newTaskManager;
    }

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
        try {
            return this._managedTaskMerger.getMergedTaskManager(taskIds, taskManager);

        } catch (error) {
            console.error("Error merging tasks:", error);
            return taskManager; // エラーが発生した場合は元のTaskManagerを返す
        }

    }

}