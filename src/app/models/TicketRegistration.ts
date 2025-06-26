import { TaskManager } from "../models/TaskManager";
import { Ticket, TicketManager } from "../models/Ticket";
import { TicketMaterial } from "../types/TicketType";

export class TicketRegistration {

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

    public createNewTickets(
        ticketManager: TicketManager,
        taskManager: TaskManager,
        ticketInfos: TicketMaterial[],
    ) {
        if (ticketInfos.length === 0) {
            throw new Error("No valid tickets provided");
        }

        let updatedTicketManager = ticketManager;
        let updatedTaskManager = taskManager;

        for (const ticketInfo of ticketInfos) {
            const newTicket = Ticket.TicketFactory(ticketInfo);
            updatedTicketManager = updatedTicketManager.addTicket(newTicket);
            updatedTaskManager = updatedTaskManager.addTaskFromTicket(newTicket);
        }

        return {
            ticketManager: updatedTicketManager,
            taskManager: updatedTaskManager,
        };
    }

    private makeEmptyTicket(): TicketMaterial {
        return {
            title: "New Ticket",
            description: "",
            enabled: true,
            phases: [],
        };
    }
}