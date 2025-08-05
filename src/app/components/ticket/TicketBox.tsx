import { TicketManager } from "@/app/models/Ticket";
import TicketDetail from "./TicketDetail";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { UUID } from "@/app/common/IdUtil";
import CancelIcon from "../atom/CancelIcon";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { useState } from "react";
import { TaskManager } from "@/app/models/TaskManager";
import { ParseToTicketService } from "@/app/service/ParseToTicketService";

export default function TicketBox(props: {
    ticketId: UUID,
    ticketManager: TicketManager,
    taskManager: TaskManager,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
    changeHandler: (ticketId: UUID, phase: PhaseEnum, duration: number) => number;
    cancelHander: () => void;
}) {

    const { ticketId, ticketManager, taskManager, changeHandler, cancelHander } = props;
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
    }

    const changeTitle = () => {

        const { newTicketManager, newTaskManager } = new TicketUpdateService().changeTitle(ticket.id, inputName, ticketManager, taskManager);
        props.setTicketManager(newTicketManager);
        props.setTaskManager(newTaskManager);
    }


    const changeDuration = (phase: PhaseEnum, duration: number) => {
        if (duration < 0) {
            throw new Error(`Duration cannot be negative for phase ${phase}`);
        }
        return changeHandler(ticketId, phase, duration);
    };

    const parseInput = (input: string) => {
        if (input.trim().length === 0) {
            return;
        }
        const { newTicketManager, newTaskManager } = new ParseToTicketService().parseAndUpdate(ticketId, ticket.title, input, ticketManager, taskManager);
        props.setTicketManager(newTicketManager);
        props.setTaskManager(newTaskManager);
    };


    return (
        <div>
            <div className="flex pb-6">
                <div className="py-1">Ticket Name : </div>
                <input
                    type="text"
                    value={inputName}
                    onChange={onChange}
                    onBlur={changeTitle}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            changeTitle();
                        }
                    }}
                    className="ml-2 border rounded px-2 py-1" />
                <nav className="ml-auto flex">
                    <CancelIcon onClick={cancelHander} />
                </nav>
            </div>
            <TicketDetail ticketPhases={ticket.phases} changeDuration={changeDuration} parseInput={parseInput} />
        </div>
    );
}