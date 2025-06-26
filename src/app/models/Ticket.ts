import { generateUUID, UUID } from "../common/IdUtil";
import { parsePhase, PhaseEnum } from "../common/PhaseEnum";
import { TicketMaterial } from "../types/TicketType";

/**
 * チケットの詳細を表すクラス。
 * チケットのフェーズ一つに相当する。
 * @param detailid チケットの詳細のID
 * @param duration チケットの詳細の所要日数
 * @param phase チケットの詳細のフェーズ
 * @param description チケットの詳細の説明
 */
export class TicketPhase {
    constructor(
        public readonly phaseId: UUID,
        public readonly duration: number,
        public readonly phase: PhaseEnum,
        public readonly description: string,
    ) { }


}

/**
 * 一つのチケットを表すクラス。チケットとは、  
 * このプロジェクトでこなすべきタスクのソースとなるもの。  
 * チケットを元に、メンバーが実際に行う作業を、タスクという。　　
 * 
 * チケットは複数の工程からなる。
 * @param id チケットのID
 * @param title チケットのタイトル
 * @param description チケットの説明
 * @param enabled チケットが有効かどうか
 * @param details チケットの詳細。PhaseEnumをキーに、TicketDetailを値に持つMap
 */
export class Ticket {

    constructor(
        public readonly id: UUID,
        public readonly title: string,
        public readonly description: string,
        public readonly enabled: boolean,
        public readonly phases: Map<PhaseEnum, TicketPhase>,
    ) {
    }

    public static TicketFactory(
        ticketMaterial: TicketMaterial,
    ): Ticket {
        const phases = new Map<PhaseEnum, TicketPhase>();
        ticketMaterial.phases.forEach(phase => {
            const phaseEnum = parsePhase(phase.phase);
            const ticketDetail = new TicketPhase(
                generateUUID(),
                phase.duration,
                phaseEnum,
                phase.description
            );
            phases.set(phaseEnum, ticketDetail);
        });
        return new Ticket(
            generateUUID(),
            ticketMaterial.title,
            ticketMaterial.description,
            ticketMaterial.enabled,
            phases
        );
    }


    get totalDuration(): number {
        return Array.from(this.phaseList).reduce((total, detail) => total + detail.duration, 0);
    }

    public getPhase(phase: PhaseEnum): TicketPhase | undefined {
        return this.phases.get(phase);
    }

    get phaseList(): readonly TicketPhase[] {
        return Array.from(this.phases.values());
    }


}

/**
 * チケットの管理を行うクラス。
 * @param ticketList チケットのリスト
 * @param ticketMap チケットのIDをキーに、チケットを値に持つMap
 * 
 */
export class TicketManager {

    private _ticketMap: Map<UUID, Ticket> = new Map<UUID, Ticket>();
    private _ticketList: Ticket[] = [];

    constructor(ticketList: Ticket[]) {
        this._ticketList = ticketList;
        this._ticketMap = new Map<UUID, Ticket>(ticketList.map(ticket => [ticket.id, ticket]));
    }

    public static TicketManagerFactory(ticketMaterials: TicketMaterial[]): TicketManager {

        const ticketList: Ticket[] = [];
        ticketMaterials.forEach(ticketMaterial => {
            const ticket = Ticket.TicketFactory(ticketMaterial);
            ticketList.push(ticket);
        });

        return new TicketManager(ticketList);

    }

    addTicket(ticket: Ticket): TicketManager {
        this._ticketMap.set(ticket.id, ticket);

        if (!this._ticketList.some(t => t.id === ticket.id)) {
            this._ticketList.push(ticket);
        } else {
            // 既存のチケットを更新
            this._ticketList = this._ticketList.map(t => t.id === ticket.id ? ticket : t);
        }


        return this;
    }

    removeTicket(ticketId: UUID): TicketManager {
        const ticket = this._ticketMap.get(ticketId);
        if (ticket) {
            this._ticketList = this._ticketList.filter(t => t.id !== ticketId);
            this._ticketMap.delete(ticketId);
        }

        return this;
    }

    getTicket(ticketId: UUID): Ticket | undefined {
        return this._ticketMap.get(ticketId);
    }

    getTicketList(): Ticket[] {
        return [...this._ticketList];
    }

    getTicketPhases(ticketId: UUID): Map<PhaseEnum, TicketPhase> | undefined {
        const ticket = this.getTicket(ticketId);
        if (ticket) {
            return ticket.phases;
        }
        return undefined;
    }

    getTicketPhase(ticketId: UUID, phase: PhaseEnum): TicketPhase | undefined {
        const ticket = this.getTicket(ticketId);
        if (ticket) {
            return ticket.getPhase(phase);
        }
        return undefined;
    }

    getTicketPhaseFromPhaseId(phaseId: string): TicketPhase | undefined {
        for (const ticket of this._ticketList) {
            const phase = ticket.phases.get(phaseId as PhaseEnum);
            if (phase) {
                return phase;
            }
        }
        return undefined;
    }

    getTicketByTitle(title: string) {
        const tickets = this._ticketList.filter(ticket => ticket.title === title);
        if (tickets.length === 0) {
            return undefined; // チケットが見つからない場合
        }
        if (tickets.length > 1) {
            throw new Error(`Multiple tickets found with title "${title}"`);
        }
        return tickets[0]; // 一つだけ見つかった場合、そのチケットを返す
    }

    getExclusiveTicketList(): Ticket[] {
        return this._ticketList.filter(ticket => !ticket.enabled);
    }

    getExclusiveTicketIds(): UUID[] {
        return this.getExclusiveTicketList().map(ticket => ticket.id);
    }

    changeTicketPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
        description: string
    ): TicketManager {
        const ticket = this.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const existingPhase = ticket.getPhase(phase);
        if (existingPhase) {
            // 既存のフェーズを更新
            const updatedPhase = new TicketPhase(
                existingPhase.phaseId,
                duration,
                phase,
                description
            );
            ticket.phases.set(phase, updatedPhase);
        } else {
            // 新しいフェーズを追加
            const newPhase = new TicketPhase(generateUUID(), duration, phase, description);
            ticket.phases.set(phase, newPhase);
        }

        return this;
    }

    replaceDurationToPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
    ): TicketManager {
        const ticket = this.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        if (duration < 0) {
            throw new Error(`Duration must be non-negative, but got ${duration}`);
        }

        const existingPhase = ticket.getPhase(phase);


        if (duration < 1) {
            // フェーズの削除
            ticket.phases.delete(phase);
        } else if (existingPhase === undefined) {
            // 新しいフェーズの追加
            const newPhase = new TicketPhase(generateUUID(), duration, phase, "");
            ticket.phases.set(phase, newPhase);

        } else {
            // フェーズの更新
            const updatedPhase = new TicketPhase(
                existingPhase.phaseId,
                duration,
                phase,
                existingPhase.description
            );
            ticket.phases.set(phase, updatedPhase);
        }

        return this;
    }

    changeTicketTitle(
        ticketId: UUID,
        newTitle: string,
    ): TicketManager {
        const ticket = this.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        // チケット名を更新
        const updatedTicket = new Ticket(
            ticketId,
            newTitle,
            ticket.description,
            ticket.enabled,
            ticket.phases
        );

        return this.addTicket(updatedTicket);

    }

    changeTicketEnabled(
        ticketId: UUID,
        enabled: boolean,
    ): TicketManager {
        const ticket = this.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        // チケットの有効/無効を更新
        const updatedTicket = new Ticket(
            ticketId,
            ticket.title,
            ticket.description,
            enabled,
            ticket.phases
        );

        return this.addTicket(updatedTicket);
    }

    toggleTicketEnabled(ticketId: UUID): TicketManager {
        const ticket = this.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        // チケットの有効/無効をトグル
        return this.changeTicketEnabled(ticketId, !ticket.enabled);
    }

}