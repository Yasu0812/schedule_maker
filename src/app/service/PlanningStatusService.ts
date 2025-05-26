import { UUID } from "../common/IdUtil";
import { isAfterPhase, isBeforePhase, PhaseEnum } from "../common/PhaseEnum";
import { difference } from "../common/SetOperationUtil";
import { PlanedTask } from "../models/PlanedTask";
import { TaskFinishedPolicy } from "../models/TaskFinishedPolicy";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";

export class PlanningStatusService {

    private _taskFinishedPolicy: TaskFinishedPolicy = new TaskFinishedPolicy();
    private _ticketFinishedPolicy: TicketFinishedPolicy = new TicketFinishedPolicy();

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

    public isAllAssignedBeforePhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this.getUnassignedTask(taskManager, planedTask);
        const unassignedTaskFromTicketBeforePhase = unassignedTasks.every(task => {
            return task.ticketId !== ticketId || !isBeforePhase(task.phase, phase);
        });

        return unassignedTaskFromTicketBeforePhase;

    }

    public isFinishedBeforePhaseWithDay(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        baseDayNum: number,
    ) {

        // TODO: 再帰的に終了を見る処理を追加したい
        // 足りないのは、baseDayNumを該当タスクの開始日に再帰的に設定していく点
        // const prephase = previousPhase(phase);
        // if (!prephase) {
        //     return true;
        // }

        // const isFinishedBeforePhase = this.isFinishedBeforePhaseWithDay(
        //     ticketId,
        //     prephase,
        //     taskManager,
        //     planedTask,
        //     baseDayNum
        // );

        // if (!isFinishedBeforePhase) {
        //     return false;
        // }

        const isBeforePhaseFinished = this.isAllAssignedBeforePhase(
            ticketId,
            phase,
            taskManager,
            planedTask
        );

        const assignedTasks = planedTask.getFromTicketId(ticketId);
        const isFinishedBeforePhaseWithDay = assignedTasks.every(assignedTask => {
            const task = taskManager.getTask(assignedTask.taskId);
            if (!task) {
                throw new Error(`Task with ID ${assignedTask.taskId} not found`);
            }
            return !isBeforePhase(task.phase, phase) || assignedTask.endDayNum < baseDayNum;
        });

        return isBeforePhaseFinished && isFinishedBeforePhaseWithDay;

    }

    public isFinishedPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {
        const unassignedTasks = this.getUnassignedTask(taskManager, planedTask);
        const unassignedTaskFromTicketPhase = unassignedTasks.every(task => {
            return task.ticketId !== ticketId || isAfterPhase(task.phase, phase);
        });

        return unassignedTaskFromTicketPhase;

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

    public getUnassignedTask(
        taskManager: TaskManager,
        planedTask: PlanedTask
    ) {

        const taskIds = new Set(taskManager.getTaskIds());
        const assignedTaskIds = new Set(planedTask.getList(taskIds).map(assignedTask => assignedTask.taskId));
        const unassignedTaskIds = difference(taskIds, assignedTaskIds);
        const unassignedTasks = taskManager.getTaskList(Array.from(unassignedTaskIds));

        return unassignedTasks;
    }
}