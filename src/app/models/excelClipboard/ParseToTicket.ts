import { PhaseEnum } from "@/app/common/PhaseEnum";
import { Task } from "../Task";
import { generateUUID, UUID } from "@/app/common/IdUtil";
import { Ticket, TicketPhase } from "../Ticket";

export class ParseToTicket {

    public fromTaskMap(
        ticketId: UUID,
        ticketTitle: string,
        taskMap: Map<PhaseEnum, Task[]>
    ): Ticket {

        const phases = new Map<PhaseEnum, TicketPhase>();

        taskMap.forEach((tasks, phase) => {
            const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
            phases.set(phase, {
                phaseId: generateUUID(),
                duration: totalDuration,
                phase: phase,
                description: "",
            });
        });

        const ticket: Ticket = new Ticket(ticketId, ticketTitle, "", true, phases);

        return ticket;
    }
}