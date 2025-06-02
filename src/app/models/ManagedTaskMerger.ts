import { UUID } from "../common/IdUtil";
import { TaskManager } from "./TaskManager";
import { TaskMergeSplitter } from "./TaskMergeSplitter";

export class ManagedTaskMerger {


    public getMergedTaskManager(taskIds: (UUID | undefined)[], taskManager: TaskManager): TaskManager {
        const taskIdSet = new Set(taskIds.filter(id => id !== undefined && id !== null));
        const normedTaskIds = Array.from(taskIdSet);

        if (taskIdSet.size < 2) {
            return taskManager; // 2つ未満のタスクIDが指定された場合は元のTaskManagerを返す
        }

        const tasks = normedTaskIds.map(id => taskManager.getTask(id)).filter(task => task !== undefined);

        const mergedTask = new TaskMergeSplitter().mergeTasks(tasks);
        const newTaskManager = taskManager.removeTasks(normedTaskIds).addTask(mergedTask);
        return newTaskManager;

    }
}