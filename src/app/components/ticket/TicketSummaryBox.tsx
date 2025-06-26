import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, phaseNameShortMap } from "@/app/common/PhaseEnum";
import { TicketManager } from "@/app/models/Ticket";
import { JellyBean } from "../decorator/JellyBean";
import { PlanedTask } from "@/app/models/PlanedTask";
import TicketSummaryRow from "./TicketSummaryRow";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { TaskManager } from "@/app/models/TaskManager";
import PlusButton from "../atom/PlusButton";
import { TicketRegistrationService } from "@/app/service/TicketRegistrationService";

export default function TicketSummaryBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedManager: PlanedTask,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
    handleSelectTicket: (ticketId: UUID) => void;
    checkHandler: (ticketId: UUID) => void;
    deleteHandler: (ticketId: UUID) => void;
    selectedId: UUID | undefined;
}) {

    const getPhaseStatus = (ticketId: UUID) => new PlanningStatusService().getTicketPhaseStatuses(
        ticketId,
        props.taskManager,
        props.planedManager
    );

    const onPlusClick = () => {

        const newManagers = new TicketRegistrationService().createNewTicket(
            props.ticketManager,
            props.taskManager,
        );

        props.setTicketManager(newManagers.ticketManager);
        props.setTaskManager(newManagers.taskManager);
    }

    return (
        <div className="ticket-summary-box">
            <h2 className="text-lg font-semibold mb-4">Ticket Summary</h2>

            <div className="text-sm font-medium overflow-y-auto max-h-[400px]">
                <table>
                    <thead>
                        <tr>
                            <th className="sticky text-left top-0 bg-white z-5">
                                <div className="flex items-center gap-4">
                                    チケット <PlusButton onClick={onPlusClick} />
                                </div>
                            </th>
                            <th className="sticky bg-white top-0 z-5">&nbsp;</th>
                            {orderedPhases.map((phase) => (
                                <th key={phase} className="sticky bg-white top-0 z-5"><JellyBean width={70} height={30} phase={phase} selected={false}>{phaseNameShortMap[phase]}</JellyBean></th>
                            ))}
                            <th className="sticky bg-white top-0 z-5">&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.ticketManager.getTicketList().map((ticket) => (
                            <TicketSummaryRow
                                key={ticket.id}
                                ticket={ticket}
                                isSelected={props.selectedId === ticket.id}
                                onClick={props.handleSelectTicket}
                                deleteHandler={() => props.deleteHandler(ticket.id)}
                                checkHandler={() => props.checkHandler(ticket.id)}
                                phaseStatuses={getPhaseStatus(ticket.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}