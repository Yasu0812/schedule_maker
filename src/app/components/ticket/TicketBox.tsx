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
            <h1><div className="flex">Ticket ID: {props.tikcet.id}<TrashIcon onClick={props.deleteHandler} /></div></h1>
            <p>チケット名: {props.tikcet.title}</p>
            <p>合計日数: {props.tikcet.totalDuration}</p>
            <TicketDetail ticketPhases={props.tikcet.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
        </div>
    );
}