import { TicketManager } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import TrashIcon from "../atom/TrashIcon";
import CancelIcon from "../atom/CancelIcon";

export default function TicketBox(props: {
    ticketId: UUID,
    ticketManager: TicketManager,
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: () => void;
    cancelHander: () => void;
}) {

    const { ticketId, ticketManager, changeHandler, deleteHandler, cancelHander } = props;
    const ticket = ticketManager.getTicket(ticketId);

    if (!ticket) {
        return <div className="text-red-500">チケットが見つかりません</div>;
    }

    const pushPlus = (phase: PhaseEnum) => {
        changeHandler(ticket.id, phase, true);
    }

    const pushMinus = (phase: PhaseEnum) => {
        changeHandler(ticket.id, phase, false);
    }


    return (
        <div>
            <div className="flex">
                チケット名: {ticket.title}
                <nav className="ml-auto flex">
                    <CancelIcon onClick={cancelHander} />
                    <TrashIcon onClick={deleteHandler} className="ml-2" />
                </nav>
            </div>
            <TicketDetail ticketPhases={ticket.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
        </div>
    );
}