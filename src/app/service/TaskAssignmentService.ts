import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { previousPhase } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "../models/CalendarCellTask";
import { CalendarDayCalculator } from "../models/CalendarDayCalculator";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import { TaskManager } from "../models/TaskManager";

export class TaskAssignmentService {

    private _calendarDayCalculator = new CalendarDayCalculator();

    public assignTask(
        task: Task,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,

    ): PlanedTask {


        if (planedTask.isTaskAssingnable(memberId, task.id, startDay, task.duration)) {
            planedTask.assignTask(task, memberId, startDay, task.duration);
        }
        return planedTask;
    }

    public disassignTask(
        assignedId: UUID,
        planedTask: PlanedTask,
    ): PlanedTask {
        const assignedTask = planedTask.getFromAssignedId(assignedId);
        if (!assignedTask) {
            throw new Error(`Assigned task not found: ${assignedId}`);
        }
        planedTask.removeTask(assignedTask.taskId);

        return planedTask;
    }

    public assignTaskFromTaskId(
        taskId: UUID,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        return this.assignTask(task, memberId, startDay, planedTask);
    }

    public autoAssignTask(
        taskId: UUID,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        calandarManager: CalendarCellTaskManager,
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }
        const prePhase = previousPhase(task.phase);

        const ticketPhaseFinishDay = this._calendarDayCalculator.getTicketPhaseFinishDay(
            task.ticketId,
            calandarManager,
            taskManager,
            prePhase
        );

        if (!ticketPhaseFinishDay) {
            throw new Error(`Ticket phase finish day not found for task: ${task.id}`);
        }

        const fastestAssignableDay = this._calendarDayCalculator.fastestAssignableDay(ticketPhaseFinishDay);

        let currentDay = fastestAssignableDay;
        while (currentDay < DateUtil.getAddDate(calandarManager.lastDate, -task.duration)) {
            for (const memberId of calandarManager.memberList) {
                if (planedTask.isTaskAssingnable(memberId, task.id, currentDay, task.duration)) {
                    return this.assignTask(task, memberId, currentDay, planedTask);
                }
            }
            currentDay = DateUtil.getEndDateNoHoliday(currentDay, 1);
        }

        throw new Error(`No available members to assign task: ${task.id} before last date: ${calandarManager.lastDate}`);

    }
}