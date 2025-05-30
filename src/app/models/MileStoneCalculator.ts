import { DateUtil } from "../common/DateUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { MileStoneManager } from "./MileStoneManager";

export default class MileStoneCalculator {


    public getAllPhasePeriods(mileStoneManager: MileStoneManager): Map<PhaseEnum, { startDay: Date, endDay: Date }> {
        const phasePeriods = new Map<PhaseEnum, { startDay: Date, endDay: Date }>();

        for (const phase of orderedPhases) {
            const period = mileStoneManager.getPhasePeriod(phase);

            if (period) {
                phasePeriods.set(phase, period);
            } else {
                // フェーズに対応するマイルストーンがない場合は、開始日と終了日を無制限に設定
                phasePeriods.set(phase, { startDay: DateUtil.ifUndefinedGetMinDate(), endDay: DateUtil.ifUndefinedGetMaxDate() });
            }
        }

        return phasePeriods;
    }
}