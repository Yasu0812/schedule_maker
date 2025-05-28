import { Ticket, TicketManager } from "@/app/models/Ticket";
import TicketBox from "./TicketBox";
import { TicketMaterial } from "@/app/types/TicketType";
import TicketRegistrationBox from "./TicketRegistrationBox";
import { TaskManager } from "@/app/models/TaskManager";
import CardDesign from "../decorator/CardDesign";


export default function TicketManagementBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    setTicketManager: (ticketManager: TicketManager) => void;
    setTaskManager: (taskManager: TaskManager) => void;
}) {

    const { ticketManager, taskManager, setTicketManager, setTaskManager } = props;

    const addTicket = (
        ticketInfo: TicketMaterial
    ) => {
        const newTicket = Ticket.TicketFactory(ticketInfo);
        const newTicketManager = ticketManager.addTicket(newTicket);
        const newTaskManager = taskManager.addTaskFromTicket(newTicket);

        setTicketManager(newTicketManager);
        setTaskManager(newTaskManager);
    }

    const ticketBoxes = ticketManager?.getTicketList().map((ticket) => {
        return <TicketBox key={ticket.id} tikcet={ticket} />;
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