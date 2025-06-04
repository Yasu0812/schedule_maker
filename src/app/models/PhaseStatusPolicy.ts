import { UUID } from "crypto";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";
import { PhaseStatus, PhaseStatusEnum } from "../common/PhaseStatusEnum";
import { TicketAssignStatus, TicketAssignStatusEnum } from "../common/TicketAssignStatusEnum";

export class PhaseStatusPolicy {

    private _unassignedTaskSelecter = new UnassignedTaskSelector();

    /**
     * チケットとフェーズに基づいて、タスクの状態を取得します。  
     * チケットの状態、制約、前後関係は考慮せず、タスクの割り当て状況のみを考慮します。
     * @param ticketId 
     * @param phase 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public getPhaseStatus(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): PhaseStatusEnum {
        const { assignedTasks, unassignedTasks } = this._unassignedTaskSelecter.getSplitTaskFromTicketIdAndPhase(
            ticketId,
            phase,
            taskManager,
            planedTask,
        );

        const existAssignedTasks = assignedTasks.length > 0;
        const existUnassignedTasks = unassignedTasks.length > 0;

        if (!existAssignedTasks && !existUnassignedTasks) {
            return PhaseStatus.NONE;
        } else if (existAssignedTasks && !existUnassignedTasks) {
            return PhaseStatus.FULL;
        } else if (!existAssignedTasks && existUnassignedTasks) {
            return PhaseStatus.UNASSIGNED;
        } else if (existAssignedTasks && existUnassignedTasks) {
            return PhaseStatus.PARTIAL;
        } else {
            throw new Error("Unexpected condition in getPhaseStatus");
        }

    }

    public getTicketAssignStatuses(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): Map<PhaseEnum, TicketAssignStatusEnum> {
        const phaseStatuses = orderedPhases.map(phase => this.getPhaseStatus(ticketId, phase, taskManager, planedTask));
        const combinatedList: TicketAssignStatusEnum[] = [];
        let beforeStatus: TicketAssignStatusEnum | undefined = undefined;
        const phaseStatusesWithTicketAssignStatus = phaseStatuses.map(phaseStatus => {
            const ticketAssignStatus = this.convertPhaseStatusToTicketAssignStatus(phaseStatus, beforeStatus);
            if (ticketAssignStatus !== TicketAssignStatus.NONE) {
                beforeStatus = ticketAssignStatus;
            }
            combinatedList.push(ticketAssignStatus);
            return ticketAssignStatus;
        });

        const phaseStatusMap = new Map<PhaseEnum, TicketAssignStatusEnum>();
        orderedPhases.forEach((phase, index) => {
            phaseStatusMap.set(phase, phaseStatusesWithTicketAssignStatus[index]);
        });

        return phaseStatusMap;

    }

    /**
     * 
     * @param phaseStatus 現在のステータス
     * @param beforeStatus 一つ前のフェーズ、存在しない場合はundefined  一つ前がNoneの場合は、再帰的に遡ったステータスを与えてください。
     * @returns 
     */
    private convertPhaseStatusToTicketAssignStatus(phaseStatus: PhaseStatusEnum, beforeStatus: TicketAssignStatusEnum | undefined): TicketAssignStatusEnum {

        if (beforeStatus === TicketAssignStatus.NONE) {
            // Noneはskipされるべきステータスのため、ここに到達してはいけない
            throw new Error("beforeStatus should not be NONE when converting phase status to ticket assign status.");
        }

        if (phaseStatus === PhaseStatus.NONE) {
            // 存在しない場合は、"存在しない"ステータスを返す
            return TicketAssignStatus.NONE;
        } else if (beforeStatus === undefined) {
            // 先頭のフェーズだった場合、制約がないため、フェーズのステータスに応じて割り当てステータスを返す
            return phaseStatus === PhaseStatus.FULL ? TicketAssignStatus.FULL : TicketAssignStatus.STARTABLE;

        } else if (beforeStatus === TicketAssignStatus.FULL) {
            // 前のフェーズがFULLの場合、制約がないため、フェーズのステータスに応じて割り当てステータスを返す
            return phaseStatus === PhaseStatus.FULL ? TicketAssignStatus.FULL : TicketAssignStatus.STARTABLE;

        } else if (beforeStatus === TicketAssignStatus.VIOLATION) {
            // 前のフェーズが違反の場合、割当をしていなければ、割当不可、割当をしていれば連帯して違反
            return phaseStatus === PhaseStatus.UNASSIGNED ? TicketAssignStatus.DISABLE : TicketAssignStatus.VIOLATION;

        } else if (beforeStatus === TicketAssignStatus.STARTABLE) {
            // 前のフェーズが割り当て可能状態の時、割当をしていなければ、割当不可、割当をしていれば違反
            return phaseStatus === PhaseStatus.UNASSIGNED ? TicketAssignStatus.DISABLE : TicketAssignStatus.VIOLATION;
        } else if (beforeStatus === TicketAssignStatus.DISABLE) {

            // 前のフェーズが割当不可状態の時、割当をしていなければ、割当不可、割当をしていれば違反
            return phaseStatus === PhaseStatus.UNASSIGNED ? TicketAssignStatus.DISABLE : TicketAssignStatus.VIOLATION;
        }

        throw new Error("Unexpected condition in convertPhaseStatusToTicketAssignStatus");

    }
}