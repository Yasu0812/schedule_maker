import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { TicketAssignStatus } from "../common/TicketAssignStatusEnum";
import Member from "./Member";
import { MileStoneManager } from "./MileStoneManager";
import { PhaseStatusPolicy } from "./PhaseStatusPolicy";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";

export default class TaskAssignablePolicy {

    private _phaseStatusPolicy = new PhaseStatusPolicy();
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
        scheduleEndDay: Date
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const phase = task.phase;

        // 本工程が開始可能かどうかを確認
        const isPrePhaseEnd = this._phaseStatusPolicy.judgePhaseStatus(
            task.ticketId,
            phase,
            taskManager,
            planedTask
        ) === TicketAssignStatus.STARTABLE;

        //TODO 必須タスクがある場合、必須タスクの終了日がstartDayより前であることを確認
        const requiredTasks = true; // ここでは仮にtrueとしています。実際には必要なロジックを実装してください。

        // マイルストーンのフェーズに含まれているかどうかを確認
        const taskStartDay = startDay;
        const taskEndDay = endDay;

        const isInMileStoneStart = mileStoneManager.isEnabledPhase(phase, taskStartDay);
        const isInMileStoneEnd = mileStoneManager.isEnabledPhase(phase, taskEndDay);

        const isMemberEnabled = member.disableDates.every(date => !DateUtil.isbetweenDates(taskStartDay, date, taskEndDay));

        const isAssignmentPermitted = this.isAssignmentPermitted(
            taskId,
            member.id,
            taskStartDay,
            taskEndDay,
            planedTask,
            scheduleStartDay,
            scheduleEndDay
        );


        return isPrePhaseEnd && isInMileStoneStart && isInMileStoneEnd && isAssignmentPermitted && requiredTasks && isMemberEnabled;
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