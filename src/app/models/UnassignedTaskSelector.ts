import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
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

    public getUnassignedTaskFromTicketId(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTasks(taskManager, planedTask);
        const filteredUnassignedTasks = unassignedTasks.filter(task => task.ticketId === ticketId);


        return filteredUnassignedTasks;
    }

    /**
     * 指定されたチケットIDとフェーズの配列に基づいて、未割り当てタスクのリストを取得します。
     *
     * @param ticketId チケットのUUID。
     * @param phase フィルタリング対象となるフェーズの配列。
     * @param taskManager タスク管理オブジェクト。
     * @param planedTask 計画済みタスクの情報。
     * @returns 指定されたフェーズに該当する未割り当てタスクの配列。
     */
    public getUnassignedTaskFromTicketIdAndPhases(
        ticketId: UUID,
        phase: PhaseEnum[],
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTaskFromTicketId(ticketId, taskManager, planedTask);
        const filteredUnassignedTasks = unassignedTasks.filter(task => phase.includes(task.phase));

        return filteredUnassignedTasks;
    }

    public getUnassignedTaskFromTicketIdAndPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTaskFromTicketIdAndPhases(ticketId, [phase], taskManager, planedTask);

        return unassignedTasks;
    }

}