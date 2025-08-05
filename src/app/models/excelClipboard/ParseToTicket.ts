import { PhaseEnum } from "@/app/common/PhaseEnum";
import { Task } from "../Task";
import { generateUUID, UUID } from "@/app/common/IdUtil";
import { Ticket, TicketPhase } from "../Ticket";

export class ParseToTicket {

    public fromTaskMap(
        ticketId: UUID,
        ticketTitle: string,
        taskMap: Map<PhaseEnum, Task>
    ): Ticket {
        const taskGroups = Map.groupBy(taskMap, (task) => task[1].phase);

        const phases = new Map<PhaseEnum, TicketPhase>();

        taskGroups.forEach((tasks, phase) => {
            const totalDuration = Array.from(tasks.values()).reduce((sum, task) => sum + task[1].duration, 0);
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