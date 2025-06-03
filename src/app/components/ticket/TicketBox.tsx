import { Ticket } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import TrashIcon from "../atom/TrashIcon";

export default function TicketBox(props: {
    tikcet: Ticket
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: () => void;
}) {


    const pushPlus = (phase: PhaseEnum) => {
        props.changeHandler(props.tikcet.id, phase, true);
    }

    const pushMinus = (phase: PhaseEnum) => {
        props.changeHandler(props.tikcet.id, phase, false);
    }


    return (
        <div>
            <div className="flex">チケット名: {props.tikcet.title}<TrashIcon onClick={props.deleteHandler} /></div>
            <TicketDetail ticketPhases={props.tikcet.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
        </div>
    );
}