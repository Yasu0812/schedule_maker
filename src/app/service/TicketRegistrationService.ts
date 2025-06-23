import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";
import { TicketRegistration } from "../models/TicketRegistration";
import { TicketMaterial } from "../types/TicketType";

export class TicketRegistrationService {

    private _ticketRegistration: TicketRegistration = new TicketRegistration();

    public createNewTicket(
        ticketManager: TicketManager,
        taskManager: TaskManager,
        ticketInfo?: TicketMaterial,
    ) {
        return this._ticketRegistration.createNewTicket(ticketManager, taskManager, ticketInfo);
    }
}