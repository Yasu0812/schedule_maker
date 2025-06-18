import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { PhaseStatus, PhaseStatusEnum } from "../common/PhaseStatusEnum";
import { TicketAssignStatus, TicketAssignStatusEnum } from "../common/TicketAssignStatusEnum";
import { PhaseCalculator } from "./PhaseCalculator";
import { UUID } from "../common/IdUtil";

export class PhaseStatusPolicy {

    private _phaseCalculator = new PhaseCalculator();


    /**
     * 各フェーズのステータスを返します。
     * 以下のロジックに基づいて返します。
     * - フェーズが存在しない場合、`TicketAssignStatusEnum.NONE`を返す
     * - 前のフェーズが`TicketAssignStatusEnum.VIOLATION`または`TicketAssignStatusEnum.DISABLE`の場合
     *  - 現在のフェーズが`PhaseStatusEnum.UNASSIGNED`の場合、`TicketAssignStatusEnum.DISABLE`を返す
     *  - 現在のフェーズが`PhaseStatusEnum.PARTIAL`または`PhaseStatusEnum.FULL`の場合、`TicketAssignStatusEnum.VIOLATION`を返す
     * - 前のフェーズが`TicketAssignStatusEnum.STARTABLE`の場合
     *  - 現在のフェーズが`PhaseStatusEnum.UNASSIGNED`の場合、`TicketAssignStatusEnum.DISABLE`を返す
     *  - 現在のフェーズが`PhaseStatusEnum.PARTIAL`の場合、`TicketAssignStatusEnum.VIOLATION`を返す
     * - 前のフェーズが`TicketAssignStatusEnum.FULL`の場合
     *  - 現在のフェーズが`PhaseStatusEnum.UNASSIGNED`の場合、`TicketAssignStatusEnum.STARTABLE`を返す
     *  - 現在のフェーズが`PhaseStatusEnum.PARTIAL`の場合、`TicketAssignStatusEnum.STARTABLE`を返す
     *  - 現在のフェーズが`PhaseStatusEnum.FULL`の場合、`TicketAssignStatusEnum.FULL`を返す
     * @param ticketId 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public judgePhaseStatuses(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): Map<PhaseEnum, TicketAssignStatusEnum> {
        const phaseDays = this._phaseCalculator.ticketPhaseStartDayAndEndDay(ticketId, taskManager, planedTask);

        const phaseStatusMap = new Map<PhaseEnum, TicketAssignStatusEnum>();
        let preJudgedPhaseStatus: TicketAssignStatusEnum = TicketAssignStatus.FULL;
        let preJudgedDays: { startDay: Date | undefined, endDay: Date | undefined } | undefined = undefined;
        orderedPhases.forEach(phase => {
            const phaseDaysForPhase = phaseDays.get(phase);
            const phaseStatus = this.getPhaseStatusFromDaysWithPrePhase(phaseDaysForPhase, preJudgedPhaseStatus);

            if (phaseStatus === TicketAssignStatus.NONE) {
                // フェーズが存在しない場合は、何もしない
                return;
            }

            if (phaseStatus === TicketAssignStatus.FULL || phaseStatus === TicketAssignStatus.STARTABLE) {
                if (preJudgedDays && preJudgedDays.startDay && preJudgedDays.endDay
                    && phaseDaysForPhase && phaseDaysForPhase.startDay && phaseDaysForPhase.endDay
                ) {
                    const isPhaseStartAfterPrePhaseEnd = phaseDaysForPhase.startDay > preJudgedDays.endDay;
                    if (!isPhaseStartAfterPrePhaseEnd) {
                        // 前のフェーズの終了日よりも、現在のフェーズの開始日が後の場合は、ステータスをSTARTABLEにする
                        preJudgedPhaseStatus = TicketAssignStatus.VIOLATION;
                        preJudgedDays = phaseDaysForPhase;

                        phaseStatusMap.set(phase, TicketAssignStatus.VIOLATION);
                        return;
                    }

                }
            }


            // 前のフェーズのステータスを更新
            preJudgedPhaseStatus = phaseStatus;
            preJudgedDays = phaseDaysForPhase;

            // フェーズのステータスをマップに追加
            phaseStatusMap.set(phase, phaseStatus);

        });

        return phaseStatusMap;
    }

    public judgePhaseStatus(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): TicketAssignStatusEnum {

        const judgePhaseStatuses = this.judgePhaseStatuses(ticketId, taskManager, planedTask);
        const phaseStatus = judgePhaseStatuses.get(phase);
        if (phaseStatus === undefined) {
            return TicketAssignStatus.NONE;
        }
        return phaseStatus;
    }

    /**
     * フェーズのスケジュール状態から、フェーズのステータスを取得します。
     * inputが存在しない場合は`PhaseStatusEnum.NONE`を返します。
     * もし、startDayとendDayの両方が存在する場合は`PhaseStatusEnum.FULL`を返します。
     * もし、startDayまたはendDayのどちらかが存在する場合は`PhaseStatusEnum.PARTIAL`を返します。
     * もし、startDayとendDayの両方が存在しない場合は`PhaseStatusEnum.UNASSIGNED`を返します。
     * @param days
     * @returns 
     */
    public getPhaseStatusFromDays(
        days: { startDay: Date | undefined, endDay: Date | undefined } | undefined
    ): PhaseStatusEnum {
        if (!days) {
            return PhaseStatus.NONE;
        }

        if (days.startDay && days.endDay) {
            return PhaseStatus.FULL;
        } else if (days.startDay || days.endDay) {
            return PhaseStatus.PARTIAL;
        } else {
            return PhaseStatus.UNASSIGNED;
        }

    }

    /**
     * フェーズの予定期間と、前のフェーズのステータスから、フェーズのステータスを取得します。
     * もし、予定期間が存在しない場合は`TicketAssignStatusEnum.NONE`を返します。
     * @param days 
     * @param prePhaseStatus 
     * @returns 
     */
    public getPhaseStatusFromDaysWithPrePhase(
        days: { startDay: Date | undefined, endDay: Date | undefined } | undefined,
        prePhaseStatus: TicketAssignStatusEnum
    ): TicketAssignStatusEnum {
        const phaseStatus = this.getPhaseStatusFromDays(days);

        if (phaseStatus === PhaseStatus.NONE) {
            return TicketAssignStatus.NONE;
        } else if (phaseStatus === PhaseStatus.UNASSIGNED) {
            if (prePhaseStatus === TicketAssignStatus.VIOLATION || prePhaseStatus === TicketAssignStatus.DISABLE) {
                return TicketAssignStatus.DISABLE;
            } else if (prePhaseStatus === TicketAssignStatus.STARTABLE) {
                return TicketAssignStatus.DISABLE;
            } else if (prePhaseStatus === TicketAssignStatus.FULL) {
                return TicketAssignStatus.STARTABLE;
            }
        } else if (phaseStatus === PhaseStatus.PARTIAL) {
            if (prePhaseStatus === TicketAssignStatus.VIOLATION || prePhaseStatus === TicketAssignStatus.DISABLE) {
                return TicketAssignStatus.VIOLATION;
            } else if (prePhaseStatus === TicketAssignStatus.STARTABLE) {
                return TicketAssignStatus.VIOLATION;
            } else if (prePhaseStatus === TicketAssignStatus.FULL) {
                return TicketAssignStatus.STARTABLE;
            }
        } else if (phaseStatus === PhaseStatus.FULL) {
            if (prePhaseStatus === TicketAssignStatus.VIOLATION || prePhaseStatus === TicketAssignStatus.DISABLE) {
                return TicketAssignStatus.VIOLATION;
            } else if (prePhaseStatus === TicketAssignStatus.STARTABLE) {
                return TicketAssignStatus.VIOLATION;
            } else if (prePhaseStatus === TicketAssignStatus.FULL) {
                return TicketAssignStatus.FULL;
            }
        } else {
            console.warn(`Unexpected phase status: ${phaseStatus}`);
            return TicketAssignStatus.NONE;
        }

        // ここに到達することはないはずですが、念のためのフォールバック
        console.warn(`Unexpected prePhaseStatus: ${prePhaseStatus}`);
        return TicketAssignStatus.NONE;
    }

}