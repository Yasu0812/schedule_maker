import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, phaseNameShortMap } from "@/app/common/PhaseEnum";
import { TicketManager } from "@/app/models/Ticket";
import { JellyBean } from "../decorator/JellyBean";
import { PlanedTask } from "@/app/models/PlanedTask";
import TicketSummaryRow from "./TicketSummaryRow";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { TaskManager } from "@/app/models/TaskManager";

export default function TicketSummaryBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedManager: PlanedTask,
    handleSelectTicket: (ticketId: UUID) => void;
    selectedId: UUID | undefined;
}) {

    const getPhaseStatus = (ticketId: UUID) => new PlanningStatusService().getTicketPhaseStatuses(
        ticketId,
        props.taskManager,
        props.planedManager
    );

    return (
        <div className="ticket-summary-box">
            <h2 className="text-lg font-semibold mb-4">Ticket Summary</h2>

            <div className="text-sm font-medium overflow-y-auto max-h-[400px]">
                <table>
                    <thead>
                        <tr>
                            <th className="sticky text-left top-0 bg-white z-5">チケット</th>
                            {orderedPhases.map((phase) => (
                                <th key={phase} className="sticky  top-0 z-5"><JellyBean width={80} height={30} phase={phase} selected={false}>{phaseNameShortMap[phase]}</JellyBean></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {props.ticketManager.getTicketList().map((ticket) => (
                            <TicketSummaryRow
                                key={ticket.id}
                                ticket={ticket}
                                isSelected={props.selectedId === ticket.id}
                                onClick={props.handleSelectTicket}
                                phaseStatuses={getPhaseStatus(ticket.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}