import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";

/**
 * 割り当て済みのタスクを表すクラス
 * 割り当てられたメンバーと、実際に割り当てられた日程を持つ
 * @param id このデータのID
 * @param ticketId 対応するチケットのID
 * @param taskId 対応するタスクのID
 * @param memberId 割り当てられたメンバーのID
 * @param startDay 割り当て開始日
 * @param duration 割り当て期間（日数）
 * @param endDay 割り当て終了日
 */
export class AssignedTask {

    public readonly endDay: Date;

    constructor(
        public readonly id: UUID,
        public readonly ticketId: UUID,
        public readonly taskId: UUID,
        public readonly memberId: UUID,
        public readonly startDay: Date,
        public readonly duration: number,
    ) {
        this.endDay = DateUtil.getEndDateNoHoliday(this.startDay, this.duration - 1);
    }

}