import { TicketManager } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import TrashIcon from "../atom/TrashIcon";
import CancelIcon from "../atom/CancelIcon";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { useState } from "react";

export default function TicketBox(props: {
    ticketId: UUID,
    ticketManager: TicketManager,
    setTicketManager: (ticketManager: TicketManager) => void;
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: () => void;
    cancelHander: () => void;
}) {

    const { ticketId, ticketManager, changeHandler, deleteHandler, cancelHander } = props;
    const ticket = ticketManager.getTicket(ticketId);

    const [inputName, setInputName] = useState(ticket?.title || "");

    if (!ticket) {
        return <div className="text-red-500">チケットが見つかりません</div>;
    }

    const pushPlus = (phase: PhaseEnum) => {
        changeHandler(ticket.id, phase, true);
    }

    const pushMinus = (phase: PhaseEnum) => {
        changeHandler(ticket.id, phase, false);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value.trim();
        setInputName(newTitle);

        if (newTitle.length === 0) {
            return;
        }

        const newManager = new TicketUpdateService().changeTitle(ticket.id, newTitle, ticketManager);
        props.setTicketManager(newManager);

    }


    return (
        <div>
            <div className="flex pb-6">
                <div className="py-1">Ticket Name : </div><input type="text" value={inputName} onChange={onChange} className="ml-2 border rounded px-2 py-1" />
                <nav className="ml-auto flex">
                    <CancelIcon onClick={cancelHander} />
                    <TrashIcon onClick={deleteHandler} className="ml-2" />
                </nav>
            </div>
            <TicketDetail ticketPhases={ticket.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
        </div>
    );
}