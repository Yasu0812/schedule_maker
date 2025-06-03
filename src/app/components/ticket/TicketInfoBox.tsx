import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketManager } from "@/app/models/Ticket";
import TicketBox from "./TicketBox";
import { UUID } from "@/app/common/IdUtil";
import { useState } from "react";

export default function TicketInfoBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: (ticketId: UUID) => void;
}) {

    const { ticketManager, changeHandler, deleteHandler } = props;

    const [selectedTicketId, setSelectedTicketId] = useState<UUID>();

    const ticketTitleList = ticketManager.getTicketList().map((ticket) => {
        return <div key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)} className="max-w-xl">{ticket.title}</div>;
    });

    const ticketBox = () => {
        if (!selectedTicketId) {
            return null;
        }
        const ticket = ticketManager.getTicket(selectedTicketId);
        if (!ticket) {
            return null;
        }
        return <TicketBox key={ticket.id} tikcet={ticket} changeHandler={changeHandler} deleteHandler={() => deleteHandler(ticket.id)} />;
    }

    return (
        <div className="flex">
            <div>
                {ticketTitleList}
            </div>
            {ticketBox()}
        </div>
    );
}