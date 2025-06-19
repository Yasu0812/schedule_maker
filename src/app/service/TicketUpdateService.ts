import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { ManagedTaskMerger } from "../models/ManagedTaskMerger";
import { PlanedTask } from "../models/PlanedTask";
import { TaskManager } from "../models/TaskManager";
import TaskUpdateApplier from "../models/TaskUpdateApplier";
import { TicketManager } from "../models/Ticket";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";


export class TicketUpdateService {

    private _taskUpdateApplier: TaskUpdateApplier = new TaskUpdateApplier();

    private _unassignedTaskSelector: UnassignedTaskSelector = new UnassignedTaskSelector();

    private _managedTaskMerger: ManagedTaskMerger = new ManagedTaskMerger();

    public taskAndPlanSync(
        taskManager: TaskManager,
        planedTaskManager: PlanedTask
    ): PlanedTask {
        const newPlanedTaskManager = this._taskUpdateApplier.updateApply(
            taskManager,
            planedTaskManager
        );

        return newPlanedTaskManager;
    }

    public changeDuration(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const beforeDuration = ticketManager.getTicketPhase(ticketId, phase)?.duration || 0;

        if (duration < 0) {
            throw new Error(`Duration cannot be negative for ticket ${ticketId}, phase ${phase}`);
        }

        const diffDuration = duration - beforeDuration;
        if (diffDuration === 0) {
            // No change in duration, return the original managers
            return { ticketManager, taskManager, planedTaskManager };
        }

        const beforeUnassignedTask = this._unassignedTaskSelector
            .getMinDurationTask(ticketId, phase, taskManager, planedTaskManager);

        const newTicketManager = ticketManager.replaceDurationToPhase(
            ticketId,
            phase,
            duration
        );

        const changeDurations = taskManager.addOrSubDurationToTask(
            ticketId,
            ticket.title,
            phase,
            diffDuration
        );

        const newTaskManager = changeDurations.taskManager;
        const newTask = changeDurations.task;

        const mergedTaskManager = this._managedTaskMerger.getMergedTaskManager(
            [beforeUnassignedTask?.id, newTask?.id],
            newTaskManager
        );

        const newPlanedTaskManager = this._taskUpdateApplier.updateApply(
            taskManager,
            planedTaskManager
        );


        return {
            ticketManager: newTicketManager,
            taskManager: mergedTaskManager,
            planedTaskManager: newPlanedTaskManager
        };
    }

    public incrementDuration(
        ticketId: UUID,
        phase: PhaseEnum,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }


        const beforeDuration = ticketManager.getTicketPhase(ticketId, phase)?.duration || 0; // Default to 0 if phase not found

        const newDuration = beforeDuration + 1;

        if (newDuration > 255) {
            return { ticketManager, taskManager, planedTaskManager }; // Duration cannot exceed 255
        }


        return this.changeDuration(ticketId, phase, newDuration, ticketManager, taskManager, planedTaskManager);
    }

    public decrementDuration(
        ticketId: UUID,
        phase: PhaseEnum,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const beforeDuration = ticketManager.getTicketPhase(ticketId, phase)?.duration;
        if (beforeDuration === undefined) {
            return { ticketManager, taskManager, planedTaskManager };
        }

        if (beforeDuration <= 0) {
            throw new Error(`Cannot decrement duration below 0 for ticket ${ticketId}, phase ${phase}`);
        }

        const newDuration = beforeDuration - 1;

        return this.changeDuration(ticketId, phase, newDuration, ticketManager, taskManager, planedTaskManager);
    }

    public changeTitle(
        ticketId: UUID,
        newTitle: string,
        ticketManager: TicketManager
    ): TicketManager {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        if (newTitle.trim() === "") {
            throw new Error("Ticket name cannot be empty");
        }

        return ticketManager.changeTicketTitle(ticketId, newTitle);
    }
}