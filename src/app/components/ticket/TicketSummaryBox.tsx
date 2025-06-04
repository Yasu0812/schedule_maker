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
        return props.selectedId === ticketId ? " selected bg-blue-100" : "";
    }

    return (
        <div className="ticket-summary-box">
            <h2 className="text-lg font-semibold mb-4">Ticket Summary</h2>

            <div className="text-sm font-medium overflow-y-auto max-h-[400px]">
                <table>
                    <thead>
                        <tr>
                            <th className="sticky text-left top-0 bg-white z-10">チケット</th>
                            {orderedPhases.map((phase) => (
                                <th key={phase} className="sticky  top-0 z-10"><JellyBean width={80} height={30} phase={phase} selected={false}>{phaseNameShortMap[phase]}</JellyBean></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.ticketManager.getTicketList().map((ticket) => (
                            <tr key={ticket.id} onClick={() => props.handleSelectTicket(ticket.id)} className={"cursor-pointer" + " " + selectedClass(ticket.id)}>
                                <td className="border px-4 py-2 ticket-summary-cell ">{ticket.title}</td>
                                {orderedPhases.map((phase) => (
                                    <td key={phase} className="border px-4 py-2 ticket-summary-cell ">
                                        {ticket.getPhase(phase)?.duration ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}