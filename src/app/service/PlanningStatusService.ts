import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { PlanedTask } from "../models/PlanedTask";
import { TaskFinishedPolicy } from "../models/TaskFinishedPolicy";
import { TaskManager } from "../models/TaskManager";
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

}