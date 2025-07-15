import { TicketManager } from "@/app/models/Ticket";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { UUID } from "@/app/common/IdUtil";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";
import TicketSummaryBox from "./TicketSummaryBox";
import TicketBox from "./TicketBox";
import { useModal } from "../modal/ModalContext";
import { useState } from "react";
import CardDesign from "../decorator/CardDesign";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";


export default function TicketManagementBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    scheduleConfiguration: ScheduleConfiguration,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
    setPlanedTask: (planedTask: PlanedTask) => void;
}) {

    const { ticketManager, taskManager, planedTask, scheduleConfiguration, setTicketManager, setTaskManager, setPlanedTask } = props;

    const { showModal, hideModal } = useModal();

    const changeHandler = (
        ticketId: UUID,
        phase: PhaseEnum,
        newDuration: number
    ) => {
        const ticketUpdateService = new TicketUpdateService();
        const newManagers = ticketUpdateService.changeDuration(
            ticketId,
            phase,
            newDuration,
            ticketManager,
            taskManager,
            planedTask,
            scheduleConfiguration
        )

        setTicketManager(newManagers.ticketManager);
        setTaskManager(newManagers.taskManager);
        setPlanedTask(newManagers.planedTaskManager);

        return newManagers.taskManager.sumDurationFromTicketIdWithPhase(
            ticketId,
            phase
        )
    }

    const deleteHandler = (ticketId: UUID) => {
        const newTicketManager = ticketManager.removeTicket(ticketId);
        const newTaskManager = taskManager.removeTasksFromTicketId(ticketId);
        const newPlanedTaskManager = planedTask.removeTaskFromTicketId(ticketId);

        setTicketManager(newTicketManager);
        setTaskManager(newTaskManager);
        setPlanedTask(newPlanedTaskManager);
    }

    const checkHandler = (ticketId: UUID) => {
        const newTicketManager = ticketManager.toggleTicketEnabled(ticketId);
        const newPlanedTaskManager = planedTask.removeTaskFromTicketId(ticketId);

        setTicketManager(newTicketManager);
        setPlanedTask(newPlanedTaskManager);

    }

    const [selectedTicketId, setSelectedTicketId] = useState<UUID>();

    const handleSelectTicket = (ticketId: UUID) => {
        setSelectedTicketId(ticketId);
        showModal(() =>
            <TicketBox
                ticketId={ticketId}
                ticketManager={ticketManager}
                taskManager={taskManager}
                setTicketManager={setTicketManager}
                setTaskManager={setTaskManager}
                changeHandler={changeHandler}
                cancelHander={hideModal}

            />
        )

    }

    return (
        <div className="w-full">
            <CardDesign>
                <TicketSummaryBox
                    ticketManager={ticketManager}
                    taskManager={taskManager}
                    planedManager={planedTask}
                    setTicketManager={setTicketManager}
                    setTaskManager={setTaskManager}
                    handleSelectTicket={handleSelectTicket}
                    checkHandler={checkHandler}
                    deleteHandler={deleteHandler}
                    selectedId={selectedTicketId}
                />
            </CardDesign>
        </div>
    );
}