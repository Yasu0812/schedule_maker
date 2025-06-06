import { UUID } from "../common/IdUtil";
import { PhaseEnum, previousPhase } from "../common/PhaseEnum";
import MileStoneCalculator from "./MileStoneCalculator";
import { MileStoneManager } from "./MileStoneManager";
import { PhaseCalculator } from "./PhaseCalculator";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";

export default class TaskAssignablePolicy {

    private _phaseCalculator = new PhaseCalculator();

    private _mileStoneCalculator = new MileStoneCalculator();
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
        memberId: UUID,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager,
        mileStoneManager: MileStoneManager
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const phase = task.phase;

        // 前工程の終了日がstartDayより前であることを確認
        const isPrePhaseEnd = this.isPhaseFinishedWithDay(
            task.ticketId,
            previousPhase(phase),
            startDay,
            taskManager,
            planedTask
        )

        //TODO 必須タスクがある場合、必須タスクの終了日がstartDayより前であることを確認
        const requiredTasks = true; // ここでは仮にtrueとしています。実際には必要なロジックを実装してください。

        // マイルストーンのフェーズに含まれているかどうかを確認
        const isInMileStone = mileStoneManager.isInPhasePeriod(phase, startDay);

        // カレンダー上の空きを確認
        const isFree = planedTask.isFree(memberId, taskId, startDay, task.duration);


        return isPrePhaseEnd && isInMileStone && isFree && requiredTasks;
    }

    /**
     * タスクが強制的に割り当て可能かどうかを判定します。
     * 最も緩い制約の元で、タスクを割り当てることができるかどうかを判断します。
     * @param taskId 
     * @param memberId 
     * @param startDay 
     * @param planedTask 
     * @param taskManager 
     * @returns 
     */
    public isTaskAssignableForce(
        taskId: UUID,
        memberId: UUID,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        // カレンダー上の空きを確認
        const isFree = planedTask.isFree(memberId, taskId, startDay, task.duration);

        return isFree;
    }

    public isPhaseFinishedWithDay(
        ticketId: UUID,
        phase: PhaseEnum | undefined,
        day: Date,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): boolean {
        const phaseEndDay = this._phaseCalculator.ticketPhaseEndDay(
            ticketId,
            phase,
            taskManager,
            planedTask
        );

        if (!phaseEndDay) {
            return false; // フェーズの終了日が未定の場合はfalse
        }

        // 指定された日がフェーズより後であることを確認
        return day > phaseEndDay;
    }

}