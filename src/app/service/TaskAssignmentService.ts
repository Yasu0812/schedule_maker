import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { previousPhases } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "../models/CalendarCellTask";
import { CalendarDayCalculator } from "../models/CalendarDayCalculator";
import { MileStoneManager } from "../models/MileStoneManager";
import { PhaseCalculator } from "../models/PhaseCalculator";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import TaskAssignablePolicy from "../models/TaskAssignablePolicy";
import { TaskManager } from "../models/TaskManager";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";

export class TaskAssignmentService {

    private _calendarDayCalculator = new CalendarDayCalculator();

    private _ticketfinishedPolicy = new TicketFinishedPolicy();

    private _taskAssignablePolicy = new TaskAssignablePolicy();

    private _unassignedTaskSelctor = new UnassignedTaskSelector();

    private _phaseCalculator = new PhaseCalculator();

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
        memberId: UUID,
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
        mileStoneManager: MileStoneManager,
        memberIds: UUID[],
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

        const prePhases = previousPhases(task.phase);
        const ticketPhaseFinishDays = this._phaseCalculator.ticketPhaseStartDayAndEndDay(
            task.ticketId,
            taskManager,
            planedTask,
            prePhases
        ).values().map(phase => phase.endDay).filter(day => day !== undefined);

        const ticketPhaseFinishDay = DateUtil.getLatestDay([...ticketPhaseFinishDays, DateUtil.getAddDate(calandarManager.firstDate, -1)]);

        const fastestAssignableDay = this._calendarDayCalculator.fastestAssignableDay(ticketPhaseFinishDay);

        let currentDay = new Date(fastestAssignableDay);
        const lastDate = calandarManager.lastDate;
        while (DateUtil.getAddDate(currentDay, task.duration - 1) <= lastDate) {
            for (const memberId of memberIds) {
                const isTaskAssignable = this._taskAssignablePolicy.isTaskAssignable(
                    taskId,
                    memberId,
                    currentDay,
                    planedTask,
                    taskManager,
                    mileStoneManager
                );
                if (isTaskAssignable) {
                    return planedTask.assignTask(task, memberId, currentDay, task.duration);;
                }
            }
            currentDay = DateUtil.getEndDateNoHoliday(currentDay, 1);
        }

        return planedTask;

    }

    public fullAutoAssignTask(
        planedTask: PlanedTask,
        taskManager: TaskManager,
        calandarManager: CalendarCellTaskManager,
        mileStoneManager: MileStoneManager,
        memberIds: UUID[],
        exclusionTicketIds: UUID[]
    ): PlanedTask {

        let candidateTasks: Task[] = this._unassignedTaskSelctor.getUnassignedTasks(taskManager, planedTask, exclusionTicketIds);
        let assignedPlanedTask = planedTask;

        while (candidateTasks.length > 0) {
            const task = candidateTasks.shift();
            if (!task) {
                break;
            }

            assignedPlanedTask = this.autoAssignTask(
                task.id,
                planedTask,
                taskManager,
                calandarManager,
                mileStoneManager,
                memberIds
            );

            if (assignedPlanedTask.get(task.id)) {
                // 割り当てが成功した場合、再度候補タスクを取得
                candidateTasks = this._unassignedTaskSelctor.getUnassignedTasks(taskManager, assignedPlanedTask, exclusionTicketIds);
            }
        }

        return planedTask;

    }
}