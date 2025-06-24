import { TicketManager } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import CancelIcon from "../atom/CancelIcon";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { useState } from "react";

export default function TicketBox(props: {
    ticketId: UUID,
    ticketManager: TicketManager,
    setTicketManager: (ticketManager: TicketManager) => void;
    changeHandler: (ticketId: UUID, phase: PhaseEnum, duration: number) => number;
    cancelHander: () => void;
}) {

    const { ticketId, ticketManager, changeHandler, cancelHander } = props;
    const ticket = ticketManager.getTicket(ticketId);

    const [inputName, setInputName] = useState(ticket?.title || "");

    if (!ticket) {
        return <div className="text-red-500">チケットが見つかりません</div>;
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


    const changeDuration = (phase: PhaseEnum, duration: number) => {
        if (duration < 0) {
            throw new Error(`Duration cannot be negative for phase ${phase}`);
        }
        return changeHandler(ticketId, phase, duration);
    };


    return (
        <div>
            <div className="flex pb-6">
                <div className="py-1">Ticket Name : </div><input type="text" value={inputName} onChange={onChange} className="ml-2 border rounded px-2 py-1" />
                <nav className="ml-auto flex">
                    <CancelIcon onClick={cancelHander} />
                </nav>
            </div>
            <TicketDetail ticketPhases={ticket.phases} changeDuration={changeDuration} />
        </div>
    );
}