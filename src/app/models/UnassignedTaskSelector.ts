import { UUID } from "../common/IdUtil";
import { orderedPhases, phaseCompare, PhaseEnum } from "../common/PhaseEnum";
import { difference } from "../common/SetOperationUtil";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";

export class UnassignedTaskSelector {

    public splitUnAndAssignedTaskId(
        taskManager: TaskManager,
        planedTask: PlanedTask,
        ticketId?: UUID,
        exclusionTicketIds: UUID[] = [],
        phases: PhaseEnum[] = orderedPhases,
    ): { assignedTaskIds: UUID[], unassignedTaskIds: UUID[] } {
        const includesTasks = taskManager.getTaskAll().values();
        // 除外するチケットIDが指定されている場合、除外する
        const filteredTaskIds = includesTasks.filter(
            task => !exclusionTicketIds.includes(task.ticketId) && phases.includes(task.phase) && (ticketId ? task.ticketId === ticketId : true)
        ).map(task => task.id);
        const taskIds = new Set(filteredTaskIds);
        const assignedTaskIds = new Set(planedTask.getAll().map(assignedTask => assignedTask.taskId).filter(taskId => taskIds.has(taskId)));
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
     * @param exclusionTicketIds 除外するチケットIDの配列（オプション）
     * @returns 未割り当てのタスクオブジェクトの配列
     */
    public getUnassignedTasks(
        taskManager: TaskManager,
        planedTask: PlanedTask,
        ticketId?: UUID,
        exclusionTicketIds?: UUID[]
    ) {
        const { unassignedTaskIds } = this.splitUnAndAssignedTaskId(taskManager, planedTask, ticketId, exclusionTicketIds);
        const unassignedTasks = taskManager.getTaskList(unassignedTaskIds)
            .sort((a, b) => a.ticketId > b.ticketId ? 1 : -1)
            .sort((a, b) => b.duration - a.duration)
            .sort((a, b) => phaseCompare(a.phase, b.phase))
            ;

        return unassignedTasks;
    }

    public splitUnAndAssignedTask(
        taskManager: TaskManager,
        planedTask: PlanedTask,
        ticketId?: UUID,
        exclusionTicketIds?: UUID[],
        phases: PhaseEnum[] = orderedPhases,
    ) {
        const { assignedTaskIds, unassignedTaskIds } = this.splitUnAndAssignedTaskId(taskManager, planedTask, ticketId, exclusionTicketIds, phases);
        const assignedTasks = taskManager.getTaskList(assignedTaskIds);
        const unassignedTasks = taskManager.getTaskList(unassignedTaskIds);

        return {
            assignedTasks,
            unassignedTasks,
        };
    }

    public getSplitTaskFromTicketIdToMap(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        exclusionTicketIds?: UUID[]
    ) {
        const { assignedTasks, unassignedTasks } = this.splitUnAndAssignedTask(taskManager, planedTask, ticketId, exclusionTicketIds);
        const assignedTaskMap = Map.groupBy(assignedTasks, assignedTask => assignedTask.phase);
        const unassignedTaskMap = Map.groupBy(unassignedTasks, unassignedTask => unassignedTask.phase);
        return {
            assignedTaskMap,
            unassignedTaskMap,
        };
    }


    public getSplitTaskFromTicketIdAndPhase(
        ticketId: UUID,
        phase: PhaseEnum | PhaseEnum[],
        taskManager: TaskManager,
        planedTask: PlanedTask,
        exclusionTicketIds?: UUID[]
    ) {
        if (!Array.isArray(phase)) {
            phase = [phase];
        }
        const { assignedTasks, unassignedTasks } = this.splitUnAndAssignedTask(taskManager, planedTask, ticketId, exclusionTicketIds);
        const assignedTasksFromTicket = assignedTasks.filter(task => task.ticketId === ticketId && phase.includes(task.phase));
        const unassignedTasksFromTicket = unassignedTasks.filter(task => task.ticketId === ticketId && phase.includes(task.phase));

        return {
            assignedTasks: assignedTasksFromTicket,
            unassignedTasks: unassignedTasksFromTicket,
        };
    }

    public getMinDurationTask(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const { unassignedTasks } = this.splitUnAndAssignedTask(
            taskManager,
            planedTask,
            ticketId,
            undefined,
            [phase]
        );
        if (unassignedTasks.length === 0) {
            return undefined;
        }
        const minDurationTask = unassignedTasks.reduce((minTask, currentTask) => {
            return currentTask.duration < minTask.duration ? currentTask : minTask;
        });

        return minDurationTask;
    }


}