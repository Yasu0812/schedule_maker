import { AssignedTask } from "./AssignedTask";
import { TicketPhase } from "./Ticket";

export class TaskProgressCalculator {

    public calcProgress(
        ticketPhase: TicketPhase,
        assignedTasks: AssignedTask[],
    ): number {
        const assignedDuration = assignedTasks.reduce((sum, task) => task.duration + sum, 0);
        return Math.min(1, assignedDuration / ticketPhase.duration);
    }

}