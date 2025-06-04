import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, PhaseEnum } from "@/app/common/PhaseEnum";
import { TicketAssignStatusEnum } from "@/app/common/TicketAssignStatusEnum";
import { Ticket } from "@/app/models/Ticket";

export default function TicketSummaryRow(props: {
    ticket: Ticket;
    isSelected: boolean;
    onClick: (ticketId: UUID) => void;
    phaseStatuses: Map<PhaseEnum, TicketAssignStatusEnum>;
}) {

    const { ticket, onClick, phaseStatuses } = props;

    const selectedClass = props.isSelected ? " selected bg-blue-100" : "";

    const isPhaseFinished = (phase: PhaseEnum) => phaseStatuses.get(phase);



    return (
        <tr onClick={() => onClick(ticket.id)} className={"cursor-pointer" + " " + selectedClass}>
            <td className="border px-4 py-2 ticket-summary-cell ">{ticket.title}</td>
            {orderedPhases.map((phase) => (
                <td key={phase} className={"border px-4 py-2 ticket-summary-cell " + isPhaseFinished(phase)}>
                    {ticket.getPhase(phase)?.duration ?? "-"}
                </td>
            ))}
        </tr>
    );
}