import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "../models/PlanedTask";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";
import { TicketDurationReconciler } from "../models/TicketDurationReconciler";


export class TicketUpdateService {

    public changeDuration(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        scheduleConfiguration: ScheduleConfiguration
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        const newManagers = new TicketDurationReconciler().changeDuration(
            ticketId,
            phase,
            duration,
            ticketManager,
            taskManager,
            planedTaskManager,
            scheduleConfiguration
        );

        return {
            ticketManager: newManagers.ticketManager,
            taskManager: newManagers.taskManager,
            planedTaskManager: newManagers.planedTaskManager
        };
    }

    public changeTitle(
        ticketId: UUID,
        newTitle: string,
        ticketManager: TicketManager,
        taskManager: TaskManager
    ): { newTicketManager: TicketManager, newTaskManager: TaskManager } {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const newTaskManager = taskManager.changeTaskTitleFromTicketId(ticketId, newTitle);

        if (newTitle.trim() === "") {
            throw new Error("Ticket name cannot be empty");
        }

        const newTicketManager = ticketManager.changeTicketTitle(ticketId, newTitle);

        return { newTicketManager, newTaskManager };
    }
}