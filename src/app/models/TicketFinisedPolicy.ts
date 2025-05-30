import { AssignmentStatus, AssignmentStatusEnum } from "../common/AssignmentStatusEnum";
import { UUID } from "../common/IdUtil";
import { isBeforePhase, PhaseEnum, previousPhases } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";

export class TicketFinishedPolicy {

    private _unassignedTaskSelector: UnassignedTaskSelector = new UnassignedTaskSelector();

    public isTicketPlanned(
        assignmentStatuses: AssignmentStatusEnum[],
    ): boolean {
        return assignmentStatuses.some((status) => status === AssignmentStatus.FULL);
    }

    /**
     * チケットが指定されたフェーズより前にすべて完了しているかどうかを判定します。
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
     * チケットにタスクを追加した場合、指定されたフェーズが完了しているかどうかを判定します。
     * @param ticketId チケットID
     * @param taskId タスクID
     * @param phase 判定基準となるフェーズ
     * @param taskManager タスク管理オブジェクト
     * @param planedTask 計画されたタスク
     * @returns フェーズが完了している場合は true、それ以外は false
     */
    public isPhaseFinishIfAddTask(
        ticketId: UUID,
        taskId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): boolean {

        const leftTasks = this._unassignedTaskSelector.getUnassignedTaskFromTicketIdAndPhases(
            ticketId,
            [phase],
            taskManager,
            planedTask
        );

        if (leftTasks.length === 0) {
            return true;
        } else if (leftTasks.length === 1 && leftTasks[0].id === taskId) {
            return true;
        }

        return false;

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
        const unassignedTasks = this._unassignedTaskSelector.getUnassignedTaskFromTicketIdAndPhases(ticketId, prePhases, taskManager, planedTask);
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

        const unassignedTasks = this._unassignedTaskSelector.getUnassignedTaskFromTicketIdAndPhase(ticketId, phase, taskManager, planedTask);
        const isAllAssigned = unassignedTasks.length === 0;

        return isAllAssigned;
    }

}