import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import Member from "./Member";
import { MileStoneManager } from "./MileStoneManager";
import { PhaseStatusPolicy } from "./PhaseStatusPolicy";
import { PlanedTask } from "./PlanedTask";
import { RequiredProjectPhaseFinishPolicy } from "./RequiredProjectPhaseFinishPolicy";
import { RequiredTaskPhaseFinishPolicy } from "./RequiredTaskPhaseFinishPolicy";
import { TaskManager } from "./TaskManager";

export default class TaskAssignablePolicy {

    private _phaseStatusPolicy = new PhaseStatusPolicy();

    private _requiredProjectPhaseFinishPolicy = new RequiredProjectPhaseFinishPolicy();

    private _requiredTaskPhaseFinishPolicy = new RequiredTaskPhaseFinishPolicy();

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
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const phase = task.phase;

        const requiredTasks = this._requiredTaskPhaseFinishPolicy.isRequiredTaskPhaseFinish(
            taskId,
            phase,
            taskManager,
            planedTask,
            startDay,
            exclusionTicketIds
        );
        if (!requiredTasks) return false; // 必須タスクがない場合、割り当て不可

        const requiredPhase = this._requiredProjectPhaseFinishPolicy.isRequiredProjectPhaseFinish(
            phase,
            taskManager,
            planedTask,
            startDay,
            exclusionTicketIds
        );
        if (!requiredPhase) return false; // 必須フェーズがない場合、割り当て不可

        // マイルストーンのフェーズに含まれているかどうかを確認
        const taskStartDay = startDay;
        const taskEndDay = endDay;
        const isInMileStoneStart = mileStoneManager.isEnabledPhase(phase, taskStartDay);
        const isInMileStoneEnd = mileStoneManager.isEnabledPhase(phase, taskEndDay);
        if (!isInMileStoneStart || !isInMileStoneEnd) return false; // マイルストーンに含まれていない場合、割り当て不可

        // memberが利用可能かどうか確認
        const isMemberEnabled = member.disableDates.every(date => !DateUtil.isbetweenDates(taskStartDay, date, taskEndDay));
        if (!isMemberEnabled) return false; // メンバーが利用不可の場合、割り当て不可

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
        if (!isAssignmentPermitted) return false; // 割り当てが物理的に不可能な場合、割り当て不可


        return true; // すべての条件を満たしている場合、割り当て可能
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