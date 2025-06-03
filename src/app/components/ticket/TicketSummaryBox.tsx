import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, phaseNameShortMap } from "@/app/common/PhaseEnum";
import { TicketManager } from "@/app/models/Ticket";
import { JellyBean } from "../decorator/JellyBean";

export default function TicketSummaryBox(props: {
    ticketManager: TicketManager
    handleSelectTicket: (ticketId: UUID) => void;
    selectedId: UUID | undefined;
}) {

    const selectedClass = (ticketId: UUID) => {
        return props.selectedId === ticketId ? " bg-blue-100" : "";
    }

    return (
        <div className="text-sm font-medium">
            <table>
                <thead>
                    <tr>
                        <th className="text-left">チケット</th>
                        {orderedPhases.map((phase) => (
                            <th key={phase} className=""><JellyBean width={80} height={30} phase={phase} selected={false}>{phaseNameShortMap[phase]}</JellyBean></th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {props.ticketManager.getTicketList().map((ticket) => (
                        <tr key={ticket.id} onClick={() => props.handleSelectTicket(ticket.id)} className={"cursor-pointer" + " " + selectedClass(ticket.id)}>
                            <td className="border px-4 py-2 ticket-summary-cell ">{ticket.title}</td>
                            {orderedPhases.map((phase) => (
                                <td key={phase} className="border px-4 py-2 ticket-summary-cell ">
                                    {ticket.getPhase(phase)?.duration ?? 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <h2 className="text-lg font-semibold">チケットの概要</h2>
                <p>現在のチケット数: {props.ticketManager.getTicketList().length}</p>
                {/* <p>完了したチケット数: {props.ticketManager.getCompletedTickets().length}</p>
                <p>進行中のチケット数: {props.ticketManager.getInProgressTickets().length}</p>
                <p>保留中のチケット数: {props.ticketManager.getPendingTickets().length}</p>
                <p>キャンセルされたチケット数: {props.ticketManager.getCancelledTickets().length}</p> */}
            </div>
        </div>
    );
}