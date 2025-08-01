import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";
import { UUID } from "../common/IdUtil";

/**
 * あるタスクを始められるかどうかを確認するポリシー  
 * 特定のタスクを始めるために、タスク内で終了している必要があるタスクが存在する場合があります。  
 * (ex. 開発の前に、設計が終了している必要がある)  
 * それらの判定を行うクラスです。  
 * 
 */
export class GroupTaskAssignPolicy {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    public isGroupTaskAssignUnique(
        taskId: UUID,
        memberId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): boolean {
        const tasks = taskManager.getTaskGroupFromTaskId(taskId);
        if (!tasks || tasks.length === 0) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        // 割当と未割り当てタスクを取得
        const tmpTaskManager = TaskManager.makeClone(tasks);
        const { assignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            tmpTaskManager,
            planedTask,
        );

        if (assignedTasks.length === 0) {
            return true;
        }

        const planedAssignedTasks = planedTask.getList(assignedTasks.map(task => task.id));

        return planedAssignedTasks.every(task => task.memberId === memberId);

    }

}