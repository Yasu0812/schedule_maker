import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { PhaseEnum, previousPhases } from "../common/PhaseEnum";
import { AssignedTask } from "../models/AssignedTask";
import { CalendarCellTaskManager } from "../models/CalendarCellTask";
import { CalendarDayCalculator } from "../models/CalendarDayCalculator";
import DurationDayCalc from "../models/DurationDayCalc";
import { MemberManager } from "../models/MemberManager";
import { MileStoneManager } from "../models/MileStoneManager";
import { PhaseCalculator } from "../models/PhaseCalculator";
import { PlanedTask } from "../models/PlanedTask";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";
import { Task } from "../models/Task";
import TaskAssignablePolicy from "../models/TaskAssignablePolicy";
import TaskFilter from "../models/TaskFilter";
import { TaskManager } from "../models/TaskManager";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";

export class TaskAssignmentService {

    private _calendarDayCalculator = new CalendarDayCalculator();

    private _ticketfinishedPolicy = new TicketFinishedPolicy();

    private _taskAssignablePolicy = new TaskAssignablePolicy();

    private _unassignedTaskSelctor = new UnassignedTaskSelector();

    private _phaseCalculator = new PhaseCalculator();

    private _durationDayCalc = new DurationDayCalc();

    private _taskFilter = new TaskFilter();

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

    /**
     * ユーザーが直接割当を行った場合。
     * スケジュール上の空きがあれば割り当てることができる。
     * @param taskId 
     * @param memberId 
     * @param startDay 
     * @param planedTask 
     * @param taskManager 
     * @param scheduleConfiguration 
     * @returns 
     */
    public assignTaskFromTaskId(
        taskId: UUID,
        memberId: UUID,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        scheduleConfiguration: ScheduleConfiguration
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }

        const endDay = this._durationDayCalc.getEndDate(
            startDay,
            task.duration,
            scheduleConfiguration.additionalHolidays,
        );

        const isAssignmentPermitted = this._taskAssignablePolicy.isAssignmentPermitted(
            taskId,
            memberId,
            startDay,
            endDay,
            planedTask,
            scheduleConfiguration.firstDate,
            scheduleConfiguration.lastDate,
        );

        if (isAssignmentPermitted) {
            planedTask.assignTask(task, memberId, startDay, endDay);
        }

        return planedTask;

    }

    public autoAssignTask(
        taskId: UUID,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        calandarManager: CalendarCellTaskManager,
        mileStoneManager: MileStoneManager,
        memberManager: MemberManager,
        scheduleConfiguration: ScheduleConfiguration
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

        let currentDay = this._durationDayCalc.getNextWorkingDay(
            ticketPhaseFinishDay,
            scheduleConfiguration.additionalHolidays,
        );
        currentDay = DateUtil.getAddDate(calandarManager.firstDate, -1);
        const lastDate = calandarManager.lastDate;
        while (DateUtil.getAddDate(currentDay, task.duration - 1) <= lastDate) {
            const currentEndDay = this._durationDayCalc.getEndDate(
                currentDay,
                task.duration,
                scheduleConfiguration.additionalHolidays,
            );
            for (const member of memberManager.members) {
                const isTaskAssignable = this._taskAssignablePolicy.isTaskAssignable(
                    taskId,
                    currentDay,
                    currentEndDay,
                    planedTask,
                    taskManager,
                    mileStoneManager,
                    member,
                    scheduleConfiguration.firstDate,
                    scheduleConfiguration.lastDate,
                );
                if (isTaskAssignable) {
                    return planedTask.assignTask(task, member.id, currentDay, currentEndDay);
                }
            }
            currentDay = this._durationDayCalc.getNextWorkingDay(
                currentDay,
                scheduleConfiguration.additionalHolidays,
            );
        }

        return planedTask;

    }

    public fullAutoAssignTask(
        planedTask: PlanedTask,
        taskManager: TaskManager,
        calandarManager: CalendarCellTaskManager,
        mileStoneManager: MileStoneManager,
        memberManager: MemberManager,
        scheduleConfiguration: ScheduleConfiguration,
        exclusionTicketIds: UUID[],
        filterOptions: { phase: PhaseEnum[], title: string }
    ): PlanedTask {

        let candidateTasks: Task[] = this._unassignedTaskSelctor.getUnassignedTasks(taskManager, planedTask, undefined, exclusionTicketIds);
        // フィルタリングを適用
        candidateTasks = this._taskFilter.filterTasks(candidateTasks, filterOptions);
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
                memberManager,
                scheduleConfiguration
            );

            if (assignedPlanedTask.get(task.id)) {
                // 割り当てが成功した場合、再度候補タスクを取得
                candidateTasks = this._unassignedTaskSelctor.getUnassignedTasks(taskManager, assignedPlanedTask, undefined, exclusionTicketIds);
                candidateTasks = this._taskFilter.filterTasks(candidateTasks, filterOptions);

            }
        }

        return planedTask;

    }

    public allCancelTasks(
    ): PlanedTask {

        return new PlanedTask(new Map<UUID, AssignedTask>());

    }
}