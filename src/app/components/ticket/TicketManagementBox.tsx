import { Ticket, TicketManager } from "@/app/models/Ticket";
import TicketBox from "./TicketBox";
import { TicketMaterial } from "@/app/types/TicketType";
import TicketRegistrationBox from "./TicketRegistrationBox";
import { TaskManager } from "@/app/models/TaskManager";
import CardDesign from "../decorator/CardDesign";
import { TicketUpdateService } from "@/app/service/TicketUpdateService";
import { UUID } from "@/app/common/IdUtil";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { PlanedTask } from "@/app/models/PlanedTask";


export default function TicketManagementBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    planedTask: PlanedTask,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
    setPlanedTask: (planedTask: PlanedTask) => void;
}) {

    const { ticketManager, taskManager, planedTask, setTicketManager, setTaskManager, setPlanedTask } = props;

    const addTicket = (
        ticketInfo: TicketMaterial
    ) => {
        const newTicket = Ticket.TicketFactory(ticketInfo);
        const newTicketManager = ticketManager.addTicket(newTicket);
        const newTaskManager = taskManager.addTaskFromTicket(newTicket);

        setTicketManager(newTicketManager);
        setTaskManager(newTaskManager);
    }

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

    const ticketBoxes = ticketManager?.getTicketList().map((ticket) => {
        return <TicketBox key={ticket.id} tikcet={ticket} changeHandler={changeHandler} deleteHandler={() => deleteHandler(ticket.id)} />;
    })

    return (
        <>
            <div className="max-w-xl">
                <CardDesign>
                    <TicketRegistrationBox addTicket={addTicket} />
                </CardDesign>
            </div>
            <div className="max-w-xl">
                <CardDesign>
                    {ticketBoxes}
                </CardDesign>
            </div>
        </>
    );
}