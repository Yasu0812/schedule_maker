import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";


export class PhaseCalculator {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    /**
     * 割り当て済みのタスクの開始日と終了日をフェーズごとに計算します。  
     * 割り当て済みのタスクも未割り当てのタスクも存在しない場合は、返り値から除外されます。  
     * 未割り当てのタスクが存在するフェーズは、開始日を最も早いタスクの開始日、終了日は未定とします。  
     * 割り当て済みのタスクが存在するフェーズは、開始日を最も早いタスクの開始日、終了日は最も遅いタスクの終了日とします。   
     * フェーズごとに独立した計算を行います。前後関係や前提フェーズの考慮をする責務は負っていません。  
     * 返り値のリストの順序は、フェーズの定義に従います。
     * @param ticketId 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public ticketPhaseStartDayAndEndDay(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        phases: PhaseEnum[] = orderedPhases
    ): Map<PhaseEnum, { startDay: Date | undefined, endDay: Date | undefined }> {

        const { assignedTaskMap, unassignedTaskMap } = this._unassignedTaskSelector.getSplitTaskFromTicketIdToMap(ticketId, taskManager, planedTask);

        const phaseStartEndDays: Map<PhaseEnum, { startDay: Date | undefined, endDay: Date | undefined }> = new Map();
        for (const phase of phases) {
            const assignedTasksForPhase = assignedTaskMap.get(phase) || [];
            const planedTasksForPhase = planedTask.getList(assignedTasksForPhase.map(at => at.id));
            const unassignedTasksForPhase = unassignedTaskMap.get(phase) || [];

            const isExistUnassigedTask = unassignedTasksForPhase.length > 0;
            const isExistAssignedTask = assignedTasksForPhase.length > 0;

            if (!isExistUnassigedTask && !isExistAssignedTask) {
                // 割り当て済みのタスクも未割り当てのタスクも存在しない
                continue;
            } else if (isExistUnassigedTask && !isExistAssignedTask) {
                // 割り当て済みのタスクが存在しないが、未割り当てのタスクが存在する場合
                phaseStartEndDays.set(phase, {
                    startDay: undefined,
                    endDay: undefined
                });
                continue;

            } else if (!isExistUnassigedTask && isExistAssignedTask) {
                // 割り当て済みのタスクが存在するが、未割り当てのタスクが存在しない場合
                const startDay = DateUtil.getFastestDay(planedTasksForPhase.map(at => at.startDay));
                const endDay = DateUtil.getLatestDay(planedTasksForPhase.map(at => at.endDay));
                phaseStartEndDays.set(phase, {
                    startDay: startDay,
                    endDay: endDay
                });
                continue;

            } else if (isExistUnassigedTask && isExistAssignedTask) {
                // 割り当て済みのタスクと未割り当てのタスクが両方存在する場合
                const startDay = DateUtil.getFastestDay(planedTasksForPhase.map(at => at.startDay));
                phaseStartEndDays.set(phase, {
                    startDay: startDay,
                    endDay: undefined
                });
                continue;

            }

        }

        return phaseStartEndDays;

    }

    public phaseStartDayAndEndDay(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        phase: PhaseEnum
    ) {

        const phaseMap = this.ticketPhaseStartDayAndEndDay(ticketId, taskManager, planedTask, [phase]);

        const phaseStartEndDays = phaseMap.get(phase);
        if (!phaseStartEndDays) {
            return undefined;
        }
        return {
            startDay: phaseStartEndDays.startDay,
            endDay: phaseStartEndDays.endDay
        };


    }

}