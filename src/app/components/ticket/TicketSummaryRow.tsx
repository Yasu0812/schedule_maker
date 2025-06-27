import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, PhaseEnum } from "@/app/common/PhaseEnum";
import { TicketAssignStatus, TicketAssignStatusEnum } from "@/app/common/TicketAssignStatusEnum";
import { Ticket } from "@/app/models/Ticket";
import TrashIcon from "../atom/TrashIcon";

export default function TicketSummaryRow(props: {
    ticket: Ticket;
    isSelected: boolean;
    onClick: (ticketId: UUID) => void;
    deleteHandler: () => void;
    checkHandler: () => void;
    phaseStatuses: Map<PhaseEnum, TicketAssignStatusEnum>;
}) {

    const { ticket, onClick, phaseStatuses } = props;

    const selectedClass = props.isSelected ? " selected bg-blue-100" : "";

    const phaseStatus = (phase: PhaseEnum) => {
        const status = phaseStatuses.get(phase);
        if (!ticket.enabled || !status) {
            return TicketAssignStatus.NONE;
        } else {
            return status;
        }
    }
    return (
        <tr className={"cursor-pointer" + " " + selectedClass}>
            <td className="border px-4 py-2 ticket-summary-cell ">{ticket.title}</td>
            <td className="border px-4 py-2 ticket-summary-cell " onClick={props.checkHandler}>
                <input
                    type="checkbox"
                    checked={ticket.enabled}
                    className="cursor-pointer"
                    readOnly
                />

            </td>
            {orderedPhases.map((phase) => (
                <td onClick={() => onClick(ticket.id)} key={phase} className={"border px-4 py-2 ticket-summary-cell " + phaseStatus(phase)}>
                    {ticket.getPhase(phase)?.duration ?? "-"}
                </td>
            ))}
            <td className="border px-4 py-2 ticket-summary-cell ">
                <div>
                    {ticket.totalDuration && ticket.enabled ? <>&nbsp;</> : <TrashIcon onClick={props.deleteHandler} />}
                </div>
            </td>
        </tr>
    );
}