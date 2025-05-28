import { difference } from "../common/SetOperationUtil";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";

export class UnassignedTaskSelector {

    /**
     * 指定されたタスクマネージャーと計画済みタスクから、未割り当てのタスク一覧を取得します。
     *
     * @param taskManager タスクの管理を行うTaskManagerインスタンス
     * @param planedTask 割り当て済みタスク情報を持つPlanedTaskインスタンス
     * @returns 未割り当てのタスクオブジェクトの配列
     */
    public getUnassignedTasks(
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {

        const taskIds = new Set(taskManager.getTaskIds());
        const assignedTaskIds = new Set(planedTask.getList(taskIds).map(assignedTask => assignedTask.taskId));
        const unassignedTaskIds = difference(taskIds, assignedTaskIds);
        const unassignedTasks = taskManager.getTaskList(Array.from(unassignedTaskIds));

        return unassignedTasks;
    }
}