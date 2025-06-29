import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";

/**
 * メンバーが実際に実行するべきタスクを表す。
 * このタスクが何のチケットの詳細に相当するかは、
 * チケットのIDとPhaseEnumで表す。
 * @param id タスクのID
 * @param ticketId チケットのID
 * @param phase タスクのフェーズ
 * @param duration タスクの所要日数
 */
export class Task {
    constructor(
        public readonly id: UUID,
        public readonly ticketId: UUID,
        public readonly ticketTitle: string,
        public readonly phase: PhaseEnum,
        public readonly duration: number,
    ) { }

}

