import { parsePhase, PhaseEnum } from "@/app/common/PhaseEnum";
import { Ticket } from "../Ticket";
import { UUID } from "@/app/common/IdUtil";

export type TicketSerializableType = {
    id: UUID;
    title: string;
    description: string;
    phases: Array<{
        phaseId: UUID;
        duration: number;
        phase: string; 
        description: string;
    }>;
};

export class TicketSerializable {

    public static serialize(ticket: Ticket): TicketSerializableType {
        const phasesArray = Array.from(ticket.phases.values()).map(phase => ({
            phaseId: phase.phaseId,
            duration: phase.duration,
            phase: phase.phase.toString(),
            description: phase.description
        }));
        return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            phases: phasesArray
        };
    }

    public static deserialize(serialized: TicketSerializableType): Ticket {
        const phasesMap = new Map<PhaseEnum, { phaseId: UUID; duration: number; phase: PhaseEnum; description: string }>();
        serialized.phases.forEach(phase => {
            phasesMap.set(parsePhase(phase.phase), {
                phaseId: phase.phaseId,
                duration: phase.duration,
                phase: parsePhase(phase.phase),
                description: phase.description
            });
        });
        return new Ticket(
            serialized.id,
            serialized.title,
            serialized.description,
            phasesMap
        );
    }

}