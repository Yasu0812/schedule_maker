import { UUID } from "../common/IdUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { ManagedTaskMerger } from "./ManagedTaskMerger";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import TaskUpdateApplier from "./TaskUpdateApplier";
import { TicketManager } from "./Ticket";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";


export class TicketDurationReconciler {

    private _taskUpdateApplier: TaskUpdateApplier = new TaskUpdateApplier();

    private _unassignedTaskSelector: UnassignedTaskSelector = new UnassignedTaskSelector();

    private _managedTaskMerger: ManagedTaskMerger = new ManagedTaskMerger();


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

    public changeDurations(
        ticketId: UUID,
        phaseDurationMap: Map<PhaseEnum, number>,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        let newTicketManager = ticketManager;
        let newTaskManager = taskManager;
        let newPlanedTaskManager = planedTaskManager;

        for (const phase of orderedPhases) {
            const result = this.changeDuration(
                ticketId,
                phase,
                phaseDurationMap.get(phase) || 0,
                newTicketManager,
                newTaskManager,
                newPlanedTaskManager
            );
            newTicketManager = result.ticketManager;
            newTaskManager = result.taskManager;
            newPlanedTaskManager = result.planedTaskManager;
        }

        return {
            ticketManager: newTicketManager,
            taskManager: newTaskManager,
            planedTaskManager: newPlanedTaskManager
        };
    }
}