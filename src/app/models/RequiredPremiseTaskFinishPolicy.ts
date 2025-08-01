import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";
import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";

/**
 * あるタスクを始められるかどうかを確認するポリシー  
 * 特定のタスクを始めるために、タスク内で終了している必要があるタスクが存在する場合があります。  
 * (ex. 開発の前に、設計が終了している必要がある)  
 * それらの判定を行うクラスです。  
 * 
 */
export class RequiredPremiseTaskFinishPolicy {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    public requiredPremiseTaskFinishDay(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): Date | undefined {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        // 割当と未割り当てタスクを取得
        const requiredPremiseTaskIds = task.taskInformation.premiseTaskIds;
        const tasks = taskManager.getTaskList(requiredPremiseTaskIds);
        const tmpTaskManager = TaskManager.makeClone(tasks);
        const { assignedTasks, unassignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            tmpTaskManager,
            planedTask,
        );

        if (unassignedTasks.length > 0) {
            // 未割り当てタスクが存在する場合は、フェーズの終了日をundefinedとして返す
            // これは、フェーズが開始できないことを意味します
            return undefined;
        }
        if (assignedTasks.length === 0) {
            // 割り当て済みのタスクが存在しない場合は、フェーズの終了日を最小日付として返す
            // これは、フェーズが開始可能であることを意味します
            return DateUtil.ifUndefinedGetMinDate();
        }

        const planedAssignedTasks = planedTask.getList(assignedTasks.map(task => task.id));

        const phaseFinishDay = DateUtil.getLatestDay(planedAssignedTasks.map(task => task.endDay));

        return phaseFinishDay;
    }

    public isRequiredPremiseTaskFinish(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        currentDay: Date,
    ): { isFinished: boolean, finishDay?: Date } {
        const finishDay = this.requiredPremiseTaskFinishDay(
            taskId,
            taskManager,
            planedTask,
        );

        if (!finishDay) {
            return { isFinished: false };
        }

        // 現在の日付がフェーズの終了日より後であることを確認
        return { isFinished: currentDay > finishDay, finishDay };
    }

}