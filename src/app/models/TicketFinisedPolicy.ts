import { UUID } from "../common/IdUtil";
import { isBeforePhase, PhaseEnum, previousPhases } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";

export class TicketFinishedPolicy {

    private _unassignedTaskSelector: UnassignedTaskSelector = new UnassignedTaskSelector();

    /**
     * チケットが指定された日時より前にすべて完了しているかどうかを判定します。
     * @param ticketId チケットID
     * @param phase 判定基準となるフェーズ
     * @param taskManager タスク管理オブジェクト
     * @param planedTask 計画されたタスク
     * @param startDay 判定基準となる開始日
     * @returns すべて完了していれば true、そうでなければ false
     */
    public isFinishedBeforePhaseWithDay(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        startDay: Date,
    ) {

        const isBeforePhaseFinished = this.isAllAssignedBeforePhase(
            ticketId,
            phase,
            taskManager,
            planedTask
        );

        if (!isBeforePhaseFinished) {
            return false;
        }

        const assignedTasks = planedTask.getFromTicketId(ticketId);
        const isFinishedBeforePhaseWithDay = assignedTasks.every(assignedTask => {
            const task = taskManager.getTask(assignedTask.taskId);
            if (!task) {
                throw new Error(`Task with ID ${assignedTask.taskId} not found`);
            }
            return !isBeforePhase(task.phase, phase) || assignedTask.endDay < startDay;
        });

        return isFinishedBeforePhaseWithDay;

    }

    /**
     * 指定されたチケットIDに関連する、指定されたフェーズより前のタスクが、すべて割り当てられているかどうかを判定します。
     *
     * @param ticketId チェック対象のチケットID
     * @param phase 判定基準となるフェーズ
     * @param taskManager タスク管理オブジェクト
     * @param planedTask 計画されたタスク
     * @returns 指定されたチケットIDに関連し、かつ指定フェーズより前の未割り当てタスクが存在しない場合は true、それ以外は false
     */
    public isAllAssignedBeforePhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const prePhases = previousPhases(phase);
        const { unassignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            taskManager,
            planedTask,
            ticketId,
            undefined,
            prePhases
        );
        const isAllAssigned = unassignedTasks.length === 0;

        return isAllAssigned;


    }

    /**
     * 指定されたチケットIDに関連する、指定されたフェーズのタスクがすべて割り当てられているかどうかを判定します。
     * @param ticketId 
     * @param phase 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public isAllAssignedPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): boolean {

        const { unassignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            taskManager,
            planedTask,
            ticketId,
            undefined,
            [phase]
        );
        const isAllAssigned = unassignedTasks.length === 0;

        return isAllAssigned;
    }

}