import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { AssignedTask } from "./AssignedTask";
import { PlanedTask } from "./PlanedTask";
import { Task } from "./Task";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";

export class TaskResolver {

    /**
     * タスクIDからTaskとAssignedTaskを解決する
     * @param taskId 
     * @param taskManager 
     * @param planedTask 
     * @returns 同一のタスクIDを持つTaskとAssignedTaskのペア
     * @throws {Error} タスクが見つからない場合、または割り当てられたタスクが見つからない場合
     */
    public resolveTaskAndAssigned(
        taskId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { task: Task, assignedTask: AssignedTask } {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const assignedTask = planedTask.get(task.id);
        if (!assignedTask) {
            throw new Error(`AssignedTask with ID ${task.id} not found`);
        }

        return { task, assignedTask };
    }

    public resolveAssignedTaskFromTicketId(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { tasks: Task[], assignedTasks: AssignedTask[] } {
        const assignedTasks = planedTask.getFromTicketId(ticketId);
        const tasks = taskManager.getTaskFromTicketId(ticketId);

        return { tasks, assignedTasks };
    }

    public resolveAssignedTaskFromTicketIdAndPhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): { tasks: Task[], assignedTasks: AssignedTask[] } {
        const tasks = taskManager.getTaskFromTicketId(ticketId);

        const phaseTasks = tasks.filter(task => task.phase === phase);
        const phaseAssignedTasks = planedTask.getList(phaseTasks.map(task => task.id));

        return { tasks: phaseTasks, assignedTasks: phaseAssignedTasks };
    }

    public resolveTaskName(
        taskId: UUID,
        ticketManager: TicketManager,
        taskManager: TaskManager
    ): string {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const ticket = ticketManager.getTicket(task.ticketId);
        if (!ticket) {
            throw new Error(`Ticket with ID ${task.ticketId} not found`);
        }

        return ticket.title;
    }
}