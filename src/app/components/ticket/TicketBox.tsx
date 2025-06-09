import { Ticket } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import TrashIcon from "../atom/TrashIcon";
import CancelIcon from "../atom/CancelIcon";

export default function TicketBox(props: {
    tikcet: Ticket
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: () => void;
    cancelHander: () => void;
}) {


    const pushPlus = (phase: PhaseEnum) => {
        props.changeHandler(props.tikcet.id, phase, true);
    }

    const pushMinus = (phase: PhaseEnum) => {
        props.changeHandler(props.tikcet.id, phase, false);
    }


    return (
        <div>
            <div className="flex">
                チケット名: {props.tikcet.title}
                <nav className="ml-auto flex">
                    <CancelIcon onClick={props.cancelHander} />
                    <TrashIcon onClick={props.deleteHandler} className="ml-2" />
                </nav>
            </div>
            <TicketDetail ticketPhases={props.tikcet.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
        </div>
    );
}