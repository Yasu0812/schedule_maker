import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { GroupTaskAssignPolicy } from "./GroupTaskAssignPolicy";
import Member from "./Member";
import { MileStoneManager } from "./MileStoneManager";
import { PlanedTask } from "./PlanedTask";
import { RequiredPremiseTaskFinishPolicy } from "./RequiredPremiseTaskFinishPolicy";
import { RequiredProjectPhaseFinishPolicy } from "./RequiredProjectPhaseFinishPolicy";
import { RequiredTaskPhaseFinishPolicy } from "./RequiredTaskPhaseFinishPolicy";
import { TaskManager } from "./TaskManager";

export default class TaskAssignablePolicy {

    private _requiredProjectPhaseFinishPolicy = new RequiredProjectPhaseFinishPolicy();

    private _requiredTaskPhaseFinishPolicy = new RequiredTaskPhaseFinishPolicy();

    private _requiredPremiseTaskFinishPolicy = new RequiredPremiseTaskFinishPolicy();

    private _groupTaskAssignPolicy = new GroupTaskAssignPolicy();

    /**
     * タスクが割り当て可能かどうかを判定します。  
     * あらゆるポリシーを考慮して、メンバーにタスクを割り当てることができるかどうかを判断します。  
     * このメソッドがtrueを返す限り、他の条件を一切考慮することなくタスクを割り当て可能です。  
     * 言い換えると、このメソッドは最後の砦であり、ここでtrueが返される場合は、
     * 他のすべてのポリシーが満たされていることを意味します。
     * @param memberId 割り当てるメンバーのID
     * @param taskId タスクのID
     * @param startDay 割り当て開始日
     * @param duration タスクの期間（日数）
     * @returns 割り当て可能な場合はtrue、そうでない場合はfalse
     */
    public isTaskAssignable(
        taskId: UUID,
        startDay: Date,
        endDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        mileStoneManager: MileStoneManager,
        member: Member,
        scheduleStartDay: Date,
        scheduleEndDay: Date,
        exclusionTicketIds: UUID[] = [],
    ): { isAssignable: boolean, reasons?: string[] } {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const phase = task.phase;
        const reasons = [];

        const premiseTasks = this._requiredPremiseTaskFinishPolicy.isRequiredPremiseTaskFinish(
            taskId,
            taskManager,
            planedTask,
            startDay,
        );
        if (!premiseTasks.finishDay) {
            reasons.push(`Premise tasks are not assigned.`);
        } else if (!premiseTasks.isFinished) {
            reasons.push(`Premise tasks are not finished. Fastest completion day is ${DateUtil.formatDateWithHyphenNoTimeZone(premiseTasks.finishDay)}`); // 前提タスクが完了していない場合、割り当て不可
        }

        const isGroupTaskAssignUnique = this._groupTaskAssignPolicy.isGroupTaskAssignUnique(
            taskId,
            member.id,
            taskManager,
            planedTask,
        );
        if (!isGroupTaskAssignUnique) {
            reasons.push(`Group task assignment is not unique. Task is assigned to multiple members.`); // グループタスクの割り当てが一意でない場合、割り当て不可
        }

        const requiredTasks = this._requiredTaskPhaseFinishPolicy.isRequiredTaskPhaseFinish(
            taskId,
            phase,
            taskManager,
            planedTask,
            startDay,
            exclusionTicketIds
        );
        if (!requiredTasks.finishDay) {
            reasons.push(`Required tasks are not all assigned.`);
        } else if (!requiredTasks.isFinished) {
            reasons.push(`Required tasks are not finished. Fastest completion day is ${DateUtil.formatDateWithHyphenNoTimeZone(requiredTasks.finishDay)}`); // 必須タスクが完了していない場合、割り当て不可
        }

        const requiredPhase = this._requiredProjectPhaseFinishPolicy.isRequiredProjectPhaseFinish(
            phase,
            taskManager,
            planedTask,
            startDay,
            exclusionTicketIds
        );
        if (!requiredPhase.finishDay) {
            reasons.push(`Required project phase is not assigned.`);
        } else if (!requiredPhase.isFinished) {
            reasons.push(`Required project phase is not finished. Fastest completion day is ${DateUtil.formatDateWithHyphenNoTimeZone(requiredPhase.finishDay)}`); // 必須プロジェクトフェーズが完了していない場合、割り当て不可
        }

        // マイルストーンのフェーズに含まれているかどうかを確認
        const taskStartDay = startDay;
        const taskEndDay = endDay;
        const isInMileStoneStart = mileStoneManager.isEnabledPhase(phase, taskStartDay);
        const isInMileStoneEnd = mileStoneManager.isEnabledPhase(phase, taskEndDay);
        if (!isInMileStoneStart || !isInMileStoneEnd) {
            reasons.push("Task phase is not in milestone."); // マイルストーンのフェーズに含まれていない場合、割り当て不可
        }

        // memberが利用可能かどうか確認
        const isMemberEnabled = member.disableDates.every(date => !DateUtil.isbetweenDates(taskStartDay, date, taskEndDay));
        if (!isMemberEnabled) {
            reasons.push("Member is not available during the task period."); // メンバーがタスク期間中に利用不可の場合、割り当て不可
        }

        // 物理的に割り当て可能かどうかを確認
        const isAssignmentPermitted = this.isAssignmentPermitted(
            taskId,
            member.id,
            taskStartDay,
            taskEndDay,
            planedTask,
            scheduleStartDay,
            scheduleEndDay
        );
        if (!isAssignmentPermitted) {
            reasons.push("Task assignment is not permitted due to scheduling constraints."); // スケジュールの制約により割り当て不可
        }

        if (reasons.length > 0) {
            return { isAssignable: false, reasons }; // 割り当て不可の理由がある場合
        }


        return { isAssignable: true }; // すべての条件を満たしている場合、割り当て可能
    }

    // その日にタスクが割り当て可能かどうかを判定します。
    public isTaskAssignableDay(
        taskId: UUID,
        currentDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        mileStoneManager: MileStoneManager,
        member: Member,
        exclusionTicketIds: UUID[] = [],
    ): { isAssignable: boolean, reason?: string } {
        return this.isTaskAssignable(
            taskId,
            currentDay,
            currentDay,
            planedTask,
            taskManager,
            mileStoneManager,
            member,
            DateUtil.ifUndefinedGetMinDate(),
            DateUtil.ifUndefinedGetMaxDate(),
            exclusionTicketIds
        );
    }

    /**
     * タスク割当時にこれだけは守らなければならない最も強い制約について判定を行います。
     * @param taskId 
     * @param memberId 
     * @param startDay 
     * @param planedTask 
     * @param taskManager 
     * @returns 
     */
    public isAssignmentPermitted(
        taskId: UUID,
        memberId: UUID,
        startDay: Date,
        endDay: Date,
        planedTask: PlanedTask,
        scheduleStartDay: Date,
        scheduleEndDay: Date
    ): boolean {
        // カレンダー上の空きを確認
        const isFree = planedTask.isFree(memberId, taskId, startDay, endDay);
        const isWithinSchedule = this.isWithinSchedule(startDay, endDay, scheduleStartDay, scheduleEndDay);

        return isFree && isWithinSchedule;
    }

    public isWithinSchedule(
        startDay: Date,
        endDay: Date,
        scheduleStartDay: Date,
        scheduleEndDay: Date
    ): boolean {
        // タスクの開始日と終了日がスケジュールの範囲内にあるかを確認
        return (
            startDay >= scheduleStartDay &&
            endDay <= scheduleEndDay
        );
    }

}