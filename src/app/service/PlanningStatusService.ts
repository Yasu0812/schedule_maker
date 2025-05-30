import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "../models/PlanedTask";
import { TaskFinishedPolicy } from "../models/TaskFinishedPolicy";
import { TaskManager } from "../models/TaskManager";
import { TaskStatusPolicy } from "../models/TaskStatusPolicy";
import { TicketManager } from "../models/Ticket";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";

export class PlanningStatusService {

    private _taskFinishedPolicy: TaskFinishedPolicy = new TaskFinishedPolicy();
    private _ticketFinishedPolicy: TicketFinishedPolicy = new TicketFinishedPolicy();
    private _taskStatusPolicy: TaskStatusPolicy = new TaskStatusPolicy();

    public getTaskPlanningStatus(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const assignedTask = planedTask.get(task.id);

        if (!assignedTask) {
            throw new Error(`AssignedTask with ID ${task.id} not found`);
        }

        const plannningStatus = this._taskFinishedPolicy.getAssignmentStatus(
            task.duration,
            assignedTask.duration,
        );

        return plannningStatus;

    }

    public isFinishedBeforePhaseWithDay(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        startDay: Date,
    ) {

        return this._ticketFinishedPolicy.isFinishedBeforePhaseWithDay(
            ticketId,
            phase,
            taskManager,
            planedTask,
            startDay
        );

    }

    public getTicketPhasePlanningStatus(
        ticketId: string,
        phase: PhaseEnum,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {

        const tikcetPhase = ticketManager.getTicketPhase(ticketId, phase);
        if (!tikcetPhase) {
            throw new Error(`TicketPhase with ID ${ticketId} not found`);
        }

        const task = taskManager.getTaskFromTicketPhase(ticketId, phase);

        const assignedTasks = planedTask.getList(task.map(t => t.id));
        const assignedTaskSum = assignedTasks.reduce((sum, assignedTask) => {
            return sum + assignedTask.duration;
        }, 0);

        const plannningStatus = this._taskFinishedPolicy.getAssignmentStatus(
            tikcetPhase.duration,
            assignedTaskSum,
        );

        return plannningStatus;

    }

    public isTicketPlanned(
        ticketId: string,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {
        const ticket = ticketManager.getTicket(ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found`);
        }

        const tasklist = taskManager.getTaskFromTicketId(ticketId);
        const taskAssignmentStatuses = tasklist.map(task => {
            return this.getTaskPlanningStatus(task.id, taskManager, planedTask);
        });

        const isTicketPlanned = this._ticketFinishedPolicy.isTicketPlanned(taskAssignmentStatuses);

        return isTicketPlanned;

    }

}