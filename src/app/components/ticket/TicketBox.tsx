import { Ticket } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";

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
            <div>
                <h1>Ticket ID: {props.tikcet.id}</h1>
                <p>チケット番号: {props.tikcet.title}</p><p onClick={props.deleteHandler}>aaa</p>
                <p>合計日数: {props.tikcet.totalDuration}</p>
                <p>チケットの説明: {props.tikcet.description}</p>
                <p>チケットの詳細:</p>
                <TicketDetail ticketPhases={props.tikcet.phases} pushPlus={pushPlus} pushMinus={pushMinus} />
            </div>
        </div>
    );
}