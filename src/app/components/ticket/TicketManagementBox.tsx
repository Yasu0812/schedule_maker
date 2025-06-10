import { TicketManager } from "@/app/models/Ticket";
import { TaskManager } from "@/app/models/TaskManager";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { UUID } from "@/app/common/IdUtil";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";
import TicketInfoBox from "./TicketInfoBox";


export default function TicketManagementBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
    setPlanedTask: (planedTask: PlanedTask) => void;
}) {

    const { ticketManager, taskManager, planedTask, setTicketManager, setTaskManager, setPlanedTask } = props;

    const changeHandler = (
        ticketId: UUID,
        phase: PhaseEnum,
        increment: boolean
    ) => {
        const ticketUpdateService = new TicketUpdateService();
        const { ticketManager: newTicketManager, taskManager: newTaskManager, planedTaskManager: newPlanedTaskManager } = increment ?
            ticketUpdateService.incrementDuration(ticketId, phase, ticketManager, taskManager, planedTask) :
            ticketUpdateService.decrementDuration(ticketId, phase, ticketManager, taskManager, planedTask);

        setTicketManager(newTicketManager);
        setTaskManager(newTaskManager);
        setPlanedTask(newPlanedTaskManager);
    }

    const deleteHandler = (ticketId: UUID) => {
        const newTicketManager = ticketManager.removeTicket(ticketId);
        const newTaskManager = taskManager.removeTasksFromTicketId(ticketId);
        const newPlanedTaskManager = planedTask.removeTaskFromTicketId(ticketId);

        setTicketManager(newTicketManager);
        setTaskManager(newTaskManager);
        setPlanedTask(newPlanedTaskManager);
    }

    return (
        <div className="w-full">
            <TicketInfoBox
                ticketManager={ticketManager}
                taskManager={taskManager}
                planedTask={planedTask}
                changeHandler={changeHandler}
                deleteHandler={deleteHandler} />
        </div>
    );
}