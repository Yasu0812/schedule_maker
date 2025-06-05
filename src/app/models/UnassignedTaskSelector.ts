import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { difference } from "../common/SetOperationUtil";
import { PlanedTask } from "./PlanedTask";
import { Task } from "./Task";
import { TaskManager } from "./TaskManager";

export class UnassignedTaskSelector {

    public getUnassignedAndAssignedTaskIds(
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { assignedTaskIds: UUID[], unassignedTaskIds: UUID[] } {
        const taskIds = new Set(taskManager.getTaskIds());
        const assignedTaskIds = new Set(planedTask.getAll().map(assignedTask => assignedTask.taskId));
        const unassignedTaskIds = difference(taskIds, assignedTaskIds);

        return {
            assignedTaskIds: Array.from(assignedTaskIds),
            unassignedTaskIds: Array.from(unassignedTaskIds),
        };
    }

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
        const { unassignedTaskIds } = this.getUnassignedAndAssignedTaskIds(taskManager, planedTask);
        const unassignedTasks = taskManager.getTaskList(unassignedTaskIds);

        return unassignedTasks;
    }

    public splitUnAndAssignedTask(
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const { assignedTaskIds, unassignedTaskIds } = this.getUnassignedAndAssignedTaskIds(taskManager, planedTask);
        const assignedTasks = taskManager.getTaskList(assignedTaskIds);
        const unassignedTasks = taskManager.getTaskList(unassignedTaskIds);

        return {
            assignedTasks,
            unassignedTasks,
        };
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

    public getSplitTaskFromTicketId(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): { assignedTasks: Task[], unassignedTasks: Task[] } {
        const { assignedTasks, unassignedTasks } = this.splitUnAndAssignedTask(taskManager, planedTask);
        const assignedTasksFromTicket = assignedTasks.filter(task => task.ticketId === ticketId);
        const unassignedTasksFromTicket = unassignedTasks.filter(task => task.ticketId === ticketId);

        return {
            assignedTasks: assignedTasksFromTicket,
            unassignedTasks: unassignedTasksFromTicket,
        };
    }

    public getSplitTaskFromTicketIdAndPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const { assignedTasks, unassignedTasks } = this.splitUnAndAssignedTask(taskManager, planedTask);
        const assignedTasksFromTicket = assignedTasks.filter(task => task.ticketId === ticketId && task.phase === phase);
        const unassignedTasksFromTicket = unassignedTasks.filter(task => task.ticketId === ticketId && task.phase === phase);

        return {
            assignedTasks: assignedTasksFromTicket,
            unassignedTasks: unassignedTasksFromTicket,
        };
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

    /**
     * チケットIDとフェーズに基づいて、未割り当てタスクのリストを取得します。
     * @param ticketId 
     * @param phase 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public getUnassignedTaskFromTicketIdAndPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTaskFromTicketIdAndPhases(ticketId, [phase], taskManager, planedTask);

        return unassignedTasks;
    }

    public getMinDurationTask(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTaskFromTicketIdAndPhase(ticketId, phase, taskManager, planedTask);
        if (unassignedTasks.length === 0) {
            return undefined;
        }
        const minDurationTask = unassignedTasks.reduce((minTask, currentTask) => {
            return currentTask.duration < minTask.duration ? currentTask : minTask;
        });

        return minDurationTask;
    }


}