import { Ticket } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";

export default function TicketBox(props: {
    tikcet: Ticket
}) {
    return (
        <div>
            <div>
                <h1>Ticket ID: {props.tikcet.id}</h1>
                <p>チケット番号: {props.tikcet.title}</p>
                <p>合計日数: {props.tikcet.totalDuration}</p>
                <p>チケットの説明: {props.tikcet.description}</p>
                <p>チケットの詳細:</p>
                <TicketDetail ticketPhases={props.tikcet.phases} />
            </div>
        </div>
    );
}