import { UUID } from "../common/IdUtil";


export type AssignTaskInfo = {
    taskId: UUID,
    ticketId: UUID,
    memberId: string,
    startDayNum: number,
    endDayNum: number,
};

/**
 * 割り当て済みのタスクを表すクラス
 * 割り当てられたメンバーと、実際に割り当てられた日程を持つ
 */
export class AssignedTask {

    constructor(
        public readonly id: UUID,
        public readonly ticketId: UUID,
        public readonly taskId: UUID,
        public readonly memberId: string,
        public readonly startDayNum: number,
        public readonly endDayNum: number,
    ) { }

    get duration(): number {
        return this.endDayNum - this.startDayNum + 1;
    }

}