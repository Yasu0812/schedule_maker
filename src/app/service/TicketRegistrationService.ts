import { TaskManager } from "../models/TaskManager";
import { Ticket, TicketManager } from "../models/Ticket";
import { TicketMaterial } from "../types/TicketType";

export class TicketRegistrationService {

    public createNewTicket(
        ticketManager: TicketManager,
        taskManager: TaskManager,
        ticketInfo?: TicketMaterial,
    ) {
        const newTicket = Ticket.TicketFactory(ticketInfo || this.makeEmptyTicket());
        const newTicketManager = ticketManager.addTicket(newTicket);
        const newTaskManager = taskManager.addTaskFromTicket(newTicket);

        return {
            ticketManager: newTicketManager,
            taskManager: newTaskManager,
        };
    }

    private makeEmptyTicket(): TicketMaterial {
        return {
            title: "New Ticket",
            description: "",
            phases: [],
        };
    }
}