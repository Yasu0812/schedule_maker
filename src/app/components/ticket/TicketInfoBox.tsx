import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketManager } from "@/app/models/Ticket";
import TicketBox from "./TicketBox";
import { UUID } from "@/app/common/IdUtil";
import { useState } from "react";
import TicketSummaryBox from "./TicketSummaryBox";
import CardDesign from "../decorator/CardDesign";

export default function TicketInfoBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: (ticketId: UUID) => void;
}) {

    const { ticketManager, taskManager, planedTask, changeHandler, deleteHandler } = props;

    const [selectedTicketId, setSelectedTicketId] = useState<UUID>();

    const handleSelectTicket = (ticketId: UUID) => {
        setSelectedTicketId(ticketId);
    }

    const handleCancelSelect = () => {
        setSelectedTicketId(undefined);
    }

    const ticketBox = () => {
        if (!selectedTicketId) {
            return null;
        }
        const ticket = ticketManager.getTicket(selectedTicketId);
        if (!ticket) {
            return null;
        }
        return <TicketBox
            key={ticket.id}
            tikcet={ticket}
            changeHandler={changeHandler}
            deleteHandler={() => deleteHandler(ticket.id)}
            cancelHander={handleCancelSelect}

        />;
    }

    return (
        <div className="flex">
            <div>
                <CardDesign>
                    <TicketSummaryBox
                        ticketManager={ticketManager}
                        taskManager={taskManager}
                        planedManager={planedTask}
                        handleSelectTicket={handleSelectTicket}
                        selectedId={selectedTicketId}
                    />
                </CardDesign>
            </div>
            <div className="relative">
                {selectedTicketId &&
                    <div className="absolute z-10">
                        <CardDesign>
                            {ticketBox()}
                        </CardDesign>
                    </div>
                }
            </div>
        </div>
    );
}