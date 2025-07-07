import { generateUUID, UUID } from "../common/IdUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { ScheduleConfiguration } from "./ScheduleConfiguration";
import { TaskManager } from "./TaskManager";
import TaskUpdateApplier from "./TaskUpdateApplier";
import { TicketManager } from "./Ticket";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";


export class TicketDurationReconciler {

    private _taskUpdateApplier: TaskUpdateApplier = new TaskUpdateApplier();

    private _unassignedTaskSelector: UnassignedTaskSelector = new UnassignedTaskSelector();

    public changeDuration(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        scheduleConfiguration: ScheduleConfiguration
    ): { ticketManager: TicketManager, taskManager: TaskManager, planedTaskManager: PlanedTask } {
        // FIXME : 副作用が多すぎるので、エラー時に不整合が起きる 副作用が無いようなコードに書き換えたい
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const beforeDuration = ticketManager.getTicketPhase(ticketId, phase)?.duration || 0;

        if (duration < 0) {
            throw new Error(`Duration cannot be negative for ticket ${ticketId}, phase ${phase}`);
        }

        const beforeUnassignedTask = () => this._unassignedTaskSelector
            .getMinDurationTask(ticketId, phase, taskManager, planedTaskManager);

        const diffDuration = duration - beforeDuration;
        const newTaskManager = taskManager;
        let newTicketDuration = beforeDuration;
        if (diffDuration < 0) {
            // Decrease duration
            for (let i = 0; i < -diffDuration; i++) {
                const unassignedTask = beforeUnassignedTask();
                if (!unassignedTask) {
                    break;
                }
                newTaskManager.decrementTaskDuration(
                    unassignedTask.id
                );
                newTicketDuration--;
            }
        } else if (diffDuration > 0) {
            // Increase duration
            for (let i = 0; i < diffDuration; i++) {
                const unassignedTask = beforeUnassignedTask();
                if (!unassignedTask) {
                    newTaskManager.addTask(
                        {
                            id: generateUUID(),
                            ticketId: ticketId,
                            ticketTitle: ticket.title,
                            phase: phase,
                            duration: 1
                        }

                    );
                } else {
                    newTaskManager.incrementTaskDuration(
                        unassignedTask.id
                    );
                }
                newTicketDuration++;
            }
        } else {
            // No change in duration, return the original managers
            return { ticketManager, taskManager, planedTaskManager };
        }

        const newTicketManager = ticketManager.replaceDurationToPhase(
            ticketId,
            phase,
            newTicketDuration
        );

        const newPlanedTaskManager = this._taskUpdateApplier.updateApply(
            newTaskManager,
            planedTaskManager,
            scheduleConfiguration
        );


        return {
            ticketManager: newTicketManager,
            taskManager: newTaskManager,
            planedTaskManager: newPlanedTaskManager
        };
    }

    public changeDurations(
        ticketId: UUID,
        phaseDurationMap: Map<PhaseEnum, number>,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        scheduleConfiguration: ScheduleConfiguration
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
                newPlanedTaskManager,
                scheduleConfiguration
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