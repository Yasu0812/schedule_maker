import { UUID } from "crypto";
import { TicketManager, Ticket } from "./Ticket";
import { TaskManager } from "./TaskManager";
import { Task } from "./Task";


export class TicketResolver {

    public resolveTicket(ticketId: UUID, ticketManager: TicketManager): Ticket | undefined {
        return ticketManager.getTicket(ticketId);
    }

    public resolveTickets(ticketIds: UUID[], ticketManager: TicketManager): Ticket[] {
        return ticketIds.map(id => this.resolveTicket(id, ticketManager)).filter(ticket => ticket !== undefined) as Ticket[];
    }

    public withTask(ticketId: UUID, ticketManager: TicketManager, taskManager: TaskManager): { ticket: Ticket, task: Task[] } {

        const ticket = this.resolveTicket(ticketId, ticketManager);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const tasks = taskManager.getTaskFromTicketId(ticketId);
        return { ticket, task: tasks };
    }

    public fromTicketTitleWithTask(
        ticketTitle: string,
        ticketManager: TicketManager,
        taskManager: TaskManager
    ) {
        const ticket = ticketManager.getTicketByTitle(ticketTitle);
        if (!ticket) {
            return undefined; // チケットが見つからない場合はundefinedを返す
        }

        const tasks = taskManager.getTaskFromTicketId(ticket.id);
        return { ticket, task: tasks };
    }

}