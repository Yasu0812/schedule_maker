import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { previousPhase } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "../models/CalendarCellTask";
import { CalendarDayCalculator } from "../models/CalendarDayCalculator";
import { PlanedTask } from "../models/PlanedTask";
import TaskAssignablePolicy from "../models/TaskAssignablePolicy";
import { TaskManager } from "../models/TaskManager";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";

export class TaskAssignmentService {

    private _calendarDayCalculator = new CalendarDayCalculator();

    private _ticketfinishedPolicy = new TicketFinishedPolicy();

    private _taskAssignablePolicy = new TaskAssignablePolicy();

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

        const isTaskAssignable = this._taskAssignablePolicy.isTaskAssignableForce(
            taskId,
            memberId,
            startDay,
            planedTask,
            taskManager
        );

        if (isTaskAssignable) {
            planedTask.assignTask(task, memberId, startDay, task.duration);
        }

        return planedTask;

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

        const isAllAssignedBeforePhase = this._ticketfinishedPolicy.isAllAssignedBeforePhase(
            task.ticketId,
            task.phase,
            taskManager,
            planedTask
        );

        if (!isAllAssignedBeforePhase) {
            return planedTask;
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
                const isTaskAssignable = this._taskAssignablePolicy.isTaskAssignableForce(
                    taskId,
                    memberId,
                    currentDay,
                    planedTask,
                    taskManager
                );
                if (isTaskAssignable) {
                    return planedTask.assignTask(task, memberId, currentDay, task.duration);;
                }
            }
            currentDay = DateUtil.getEndDateNoHoliday(currentDay, 1);
        }

        throw new Error(`No available members to assign task: ${task.id} before last date: ${calandarManager.lastDate}`);

    }
}