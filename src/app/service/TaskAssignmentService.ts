import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { AssignedTask } from "../models/AssignedTask";
import DurationDayCalc from "../models/DurationDayCalc";
import { MemberManager } from "../models/MemberManager";
import { MemberSorter } from "../models/MemberSorter";
import { MileStoneManager } from "../models/MileStoneManager";
import { PlanedTask } from "../models/PlanedTask";
import { RequiredProjectPhaseFinishPolicy } from "../models/RequiredProjectPhaseFinishPolicy";
import { RequiredTaskPhaseFinishPolicy } from "../models/RequiredTaskPhaseFinishPolicy";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";
import { Task } from "../models/Task";
import TaskAssignablePolicy from "../models/TaskAssignablePolicy";
import TaskFilter from "../models/TaskFilter";
import { TaskManager } from "../models/TaskManager";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";

export class TaskAssignmentService {

    private _ticketfinishedPolicy = new TicketFinishedPolicy();

    private _taskAssignablePolicy = new TaskAssignablePolicy();

    private _unassignedTaskSelctor = new UnassignedTaskSelector();

    private _durationDayCalc = new DurationDayCalc();

    private _taskFilter = new TaskFilter();

    private _memberSorter = new MemberSorter();

    private _requiredProjectPhaseFinishPolicy = new RequiredProjectPhaseFinishPolicy();

    private _requiredTaskPhaseFinishPolicy = new RequiredTaskPhaseFinishPolicy();

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
        mileStoneManager: MileStoneManager,
        memberManager: MemberManager,
        scheduleConfiguration: ScheduleConfiguration,
        exclusionTicketIds: UUID[],
    ): PlanedTask {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task not found: ${taskId}`);
        }

        const phaseFinishDay = this._requiredTaskPhaseFinishPolicy.requiredTaskPhaseFinishDay(
            taskId,
            task.phase,
            taskManager,
            planedTask,
            exclusionTicketIds
        );

        const requiredPhaseFinishDay = this._requiredProjectPhaseFinishPolicy.requiredProjectPhaseFinishDay(
            task.phase,
            taskManager,
            planedTask,
            exclusionTicketIds
        );

        const firstDate = DateUtil.getAddDate(scheduleConfiguration.firstDate, -1);

        if (!phaseFinishDay || !requiredPhaseFinishDay) {
            // フェーズの終了日が取得できない場合は、割り当てを行わない
            return planedTask;
        }

        let currentDay = DateUtil.getLatestDay(
            [
                phaseFinishDay,
                requiredPhaseFinishDay,
                firstDate,
            ]
        );
        currentDay = scheduleConfiguration.getNextWorkingDay(
            currentDay
        );
        const lastDate = scheduleConfiguration.lastDate;
        const priorityMembers = this._memberSorter.sortByProgress(
            task.ticketId,
            taskManager,
            planedTask,
            memberManager,
        );
        while (DateUtil.getAddDate(currentDay, task.duration - 1) <= lastDate) {
            const currentEndDay = this._durationDayCalc.getEndDate(
                currentDay,
                task.duration,
                scheduleConfiguration.additionalHolidays,
            );
            for (const member of priorityMembers) {
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
                    exclusionTicketIds
                );
                if (isTaskAssignable.isAssignable) {
                    return planedTask.assignTask(task, member.id, currentDay, currentEndDay);
                }
            }
            currentDay = scheduleConfiguration.getNextWorkingDay(
                currentDay
            );
        }

        return planedTask;

    }

    public fullAutoAssignTask(
        planedTask: PlanedTask,
        taskManager: TaskManager,
        mileStoneManager: MileStoneManager,
        memberManager: MemberManager,
        scheduleConfiguration: ScheduleConfiguration,
        exclusionTicketIds: UUID[],
        filterOptions: { phase: PhaseEnum[], title: string }
    ): PlanedTask {

        let candidateTasks: Task[] = this._unassignedTaskSelctor.getUnassignedTasks(taskManager, planedTask, undefined, exclusionTicketIds);
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
                mileStoneManager,
                memberManager,
                scheduleConfiguration,
                exclusionTicketIds
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