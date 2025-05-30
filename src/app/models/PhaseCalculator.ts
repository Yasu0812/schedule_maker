import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { AssignedTaskSelector } from "./AssignedTaskSelector";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";


export class PhaseCalculator {

    private _assignedTaskSelector = new AssignedTaskSelector();

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    /**
     * 割り当て済みのタスクの開始日と終了日をフェーズごとに計算します。  
     * 割り当て済みのタスクが存在しないフェーズはスキップされます。  
     * 返り値のリストの順序は、フェーズの定義に従います。
     * @param ticketId 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public ticketPhaseStartDayAndEndDay(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): Map<PhaseEnum, { startDay: Date, endDay: Date }> {

        const assignedTasks = this._assignedTaskSelector.getAssignedTaskAndPhase(ticketId, taskManager, planedTask);


        const phaseStartEndDays: Map<PhaseEnum, { startDay: Date, endDay: Date }> = new Map();
        for (const phase of orderedPhases) {
            const assignedTasksForPhase = assignedTasks.get(phase) || [];
            if (assignedTasksForPhase.length === 0) {
                continue;
            }
            // フェーズ内のタスクの開始日と終了日を取得
            const startDay = DateUtil.getFastestDay(assignedTasksForPhase.map(at => at.assignedTask.startDay));
            const endDay = DateUtil.getLatestDay(assignedTasksForPhase.map(at => at.assignedTask.endDay));

            phaseStartEndDays.set(phase, { startDay: startDay, endDay: endDay });
        }

        return phaseStartEndDays;

    }

    /**
     * 各フェーズの終了日を計算したMapを返します。
     * 終了日が未定のフェーズは、終了日をundefinedとして扱います。
     * @param ticketId 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public ticketPhaseEndDay(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): Map<PhaseEnum, Date | undefined> {

        const ticketPhaseStartDayAndEndDay = this.ticketPhaseStartDayAndEndDay(
            ticketId,
            taskManager,
            planedTask
        )

        const phaseEndDays: Map<PhaseEnum, Date | undefined> = new Map();
        let trackingDate: Date | undefined = new Date(-8640000000000000); // 最小値を設定
        for (const phase of orderedPhases) {
            if (!trackingDate) {
                // 前のフェーズが未定ならこのフェーズも未定
                phaseEndDays.set(phase, undefined);
                continue;
            }

            const assignedDatesForPhase = ticketPhaseStartDayAndEndDay.get(phase);
            if (!assignedDatesForPhase) {
                // フェーズに割り当てられたタスクがない場合は追跡日を更新しない
                phaseEndDays.set(phase, trackingDate);
                continue;
            }

            const isOveredStartDay = trackingDate >= assignedDatesForPhase.startDay;
            if (isOveredStartDay) {
                // 前のフェーズの終了日が現在のフェーズの開始日を超えている場合、終了日は未定
                trackingDate = undefined;
                phaseEndDays.set(phase, undefined);
                continue;
            }

            trackingDate = assignedDatesForPhase ? assignedDatesForPhase.endDay : trackingDate;

            // 未割り当てのタスクが存在するかどうかを確認
            const isExistUnassigedTask = this._unassignedTaskSelector.getUnassignedTaskFromTicketIdAndPhase(
                ticketId,
                phase,
                taskManager,
                planedTask
            ).length > 0;


            if (isExistUnassigedTask) {
                // 未割り当てのタスクが存在する場合、終了日は未定
                trackingDate = undefined;
                phaseEndDays.set(phase, undefined);
                continue;
            }

            phaseEndDays.set(phase, new Date(trackingDate));
        }

        return phaseEndDays;

    }

}