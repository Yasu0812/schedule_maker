import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";
import { Phase, PhaseEnum } from "../common/PhaseEnum";
import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";

/**
 * あるフェーズを始められるかどうかを確認するポリシー  
 * 特定のフェーズを始めるために、プロジェクト全体で終了している必要があるフェーズが存在する場合があります。  
 * (ex. 結合テストの前に、全てのユニットテストが終了している必要がある)  
 * それらの判定を行うクラスです。  
 * 
 */
export class RequiredProjectPhaseFinishPolicy {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    public requiredProjectPhaseFinishDay(
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        exclusionTicketIds: UUID[] = []
    ): Date | undefined {
        const requiredPhases = this.getProjectRequiredPhase(phase);
        if (requiredPhases.length === 0) {
            // 必須フェーズがない場合は、常に最小日付を返す
            // これは、フェーズが開始可能であることを意味します
            return DateUtil.ifUndefinedGetMinDate();
        }

        // チケットのフェーズを取得
        const { assignedTasks, unassignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            taskManager,
            planedTask,
            undefined,
            exclusionTicketIds,
            requiredPhases
        );

        if (unassignedTasks.length > 0) {
            // 未割り当てタスクが存在する場合は、フェーズの終了日を最大日付として返す
            // これは、フェーズが開始できないことを意味します
            return;
        }
        if (assignedTasks.length === 0) {
            // 割り当て済みのタスクが存在しない場合は、フェーズの終了日を最小日付として返す
            // これは、フェーズが開始可能であることを意味します
            return DateUtil.ifUndefinedGetMinDate();
        }

        const planedAssignedTasks = planedTask.getList(assignedTasks.map(task => task.id));

        const phaseFinishDay = DateUtil.getLatestDay(planedAssignedTasks.map(task => task.endDay));

        return phaseFinishDay;
    }

    public isRequiredProjectPhaseFinish(
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        currentDay: Date,
        exclusionTicketIds: UUID[] = []
    ): { isFinished: boolean, finishDay?: Date } {
        const finishDay = this.requiredProjectPhaseFinishDay(
            phase,
            taskManager,
            planedTask,
            exclusionTicketIds
        );

        if (!finishDay) {
            return { isFinished: false };
        }

        // 現在の日付がフェーズの終了日より後であることを確認
        return { isFinished: currentDay > finishDay, finishDay };
    }

    public getProjectRequiredPhase(
        phase: PhaseEnum
    ): PhaseEnum[] {
        // TODO: ScheduleConfigurationから取得するようにしたい
        // 内部結合テストの必須フェーズを取得
        if (phase === Phase.INTEGRATION_TEST_INTERNAL) {
            return [
                Phase.REQUIREMENTS_DEFINITION,
                Phase.DESIGN,
                Phase.DEVELOPMENT,
                Phase.UNIT_TEST_DOCUMENT_CREATION,
                Phase.UNIT_TEST,
            ];
        // 外部結合テストの必須フェーズを取得
        } else if (phase === Phase.INTEGRATION_TEST_EXTERNAL) {
            return [
                Phase.REQUIREMENTS_DEFINITION,
                Phase.DESIGN,
                Phase.DEVELOPMENT,
                Phase.UNIT_TEST_DOCUMENT_CREATION,
                Phase.UNIT_TEST,
            ];
        // 性能テストの必須フェーズを取得
        } else if (phase === Phase.PERFORMANCE_TEST) {
            return [
                Phase.INTEGRATION_TEST_INTERNAL,
                Phase.INTEGRATION_TEST_EXTERNAL,
            ];
        }


        return []; // 他のフェーズでは特に必要なフェーズはない

    }
}