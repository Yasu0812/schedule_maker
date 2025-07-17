import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { TaskResolver } from "./TaskResolver";


export class ProgressCalculator {

    private _taskResolver = new TaskResolver();

    public sumDuration(
        memberId: UUID,
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,

    ): number {
        const assignedTasks = planedTask.getProgressingTasksFromTicketId(memberId, ticketId);
        const tasks = taskManager.getTaskList(assignedTasks.map(at => at.taskId));
        const sumDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
        return sumDuration;
    }

    public getProgress(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): number {
        const { tasks, assignedTasks } = this._taskResolver.resolveAssignedTaskFromTicketIdAndPhase(ticketId, phase, taskManager, planedTask);
        const assignedTaskTask = assignedTasks.map(at => taskManager.getTask(at.taskId)).filter(task => task !== undefined);
        const sumDuration = assignedTaskTask.reduce((sum, task) => sum + task.duration, 0);
        const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
        return Math.floor(sumDuration / totalDuration * 100) || 0;
    }
}