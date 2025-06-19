import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketManager } from "@/app/models/Ticket";
import TicketBox from "./TicketBox";
import { UUID } from "@/app/common/IdUtil";
import { useState } from "react";
import TicketSummaryBox from "./TicketSummaryBox";
import CardDesign from "../decorator/CardDesign";
import { useModal } from "../modal/ModalContext";

export default function TicketInfoBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    changeHandler: (ticketId: UUID, phase: PhaseEnum, increment: boolean) => void;
    deleteHandler: (ticketId: UUID) => void;
}) {

    const { ticketManager, taskManager, planedTask, changeHandler, deleteHandler } = props;

    const { showModal, hideModal } = useModal();

    const [selectedTicketId, setSelectedTicketId] = useState<UUID>();

    const handleSelectTicket = (ticketId: UUID) => {
        setSelectedTicketId(ticketId);
        showModal(() =>
            <TicketBox
                ticketId={ticketId}
                ticketManager={ticketManager}
                changeHandler={changeHandler}
                deleteHandler={() => { deleteHandler(ticketId); hideModal() }}
                cancelHander={hideModal}

            />
        )

    }

    return (
        <div className="flex">
            <div className="w-full">
                <CardDesign>
                    <TicketSummaryBox
                        ticketManager={ticketManager}
                        taskManager={taskManager}
                        planedManager={planedTask}
                        handleSelectTicket={handleSelectTicket}
                        selectedId={selectedTicketId}
                    />
                </CardDesign>
            </div>
        </div>
    );
}