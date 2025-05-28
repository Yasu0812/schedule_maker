import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";

/**
 * 割り当て済みのタスクを表すクラス
 * 割り当てられたメンバーと、実際に割り当てられた日程を持つ
 */
export class AssignedTask {

    public readonly endDay: Date;

    constructor(
        public readonly id: UUID,
        public readonly ticketId: UUID,
        public readonly taskId: UUID,
        public readonly memberId: string,
        public readonly startDay: Date,
        public readonly duration: number,
    ) {
        this.endDay = DateUtil.getEndDateNoHoliday(this.startDay, this.duration - 1);
    }

}