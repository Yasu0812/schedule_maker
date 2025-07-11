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
export class RequiredTaskPhaseFinishPolicy {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    public isRequiredTaskPhaseFinish(
        taskId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        currentDay: Date,
        exclusionTicketIds: UUID[] = []
    ): boolean {
        const ticket = taskManager.getTask(taskId);
        if (!ticket) {
            throw new Error(`Task with ID ${taskId} not found`);
        }
        const requiredPhases = this.getTaskRequiredPhase(phase);
        if (requiredPhases.length === 0) {
            // 必須フェーズがない場合は、常にtrueを返す
            return true;
        }

        // チケットのフェーズを取得
        const { assignedTasks, unassignedTasks } = this._unassignedTaskSelector.splitUnAndAssignedTask(
            taskManager,
            planedTask,
            ticket.ticketId,
            exclusionTicketIds,
            requiredPhases
        );

        if (unassignedTasks.length > 0) {
            // 未割り当てタスクが存在する場合は、フェーズの終了
            return false;
        }
        if (assignedTasks.length === 0) {
            // 割り当て済みのタスクが存在しない場合は、フェーズの終了
            return true;
        }

        const planedAssignedTasks = planedTask.getList(assignedTasks.map(task => task.id));

        const phaseFinishDay = DateUtil.getLatestDay(planedAssignedTasks.map(task => task.endDay));

        // 現在の日付がフェーズの終了日より後であることを確認
        return currentDay > phaseFinishDay;
    }

    public getTaskRequiredPhase(
        phase: PhaseEnum
    ): PhaseEnum[] {
        // TODO: ScheduleConfigurationから取得するようにしたい
        // 結合テストの必須フェーズを取得
        if (phase === Phase.DESIGN) {
            return [
                Phase.REQUIREMENTS_DEFINITION,
            ];
        } else if (phase === Phase.DEVELOPMENT) {
            return [
                Phase.DESIGN,
            ];
        } else if (phase === Phase.UNIT_TEST_DOCUMENT_CREATION) {
            return [
                Phase.DESIGN,
            ];
        } else if (phase === Phase.UNIT_TEST) {
            return [
                Phase.DEVELOPMENT,
                Phase.UNIT_TEST_DOCUMENT_CREATION,
            ];
        } else if (phase === Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION) {
            return [
                Phase.DEVELOPMENT,
                Phase.UNIT_TEST_DOCUMENT_CREATION,
            ];
        } else if (phase === Phase.INTEGRATION_TEST_INTERNAL) {
            return [
                Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION,
            ];
        } else if (phase === Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION) {
            return [
                Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION,
            ];
        } else if (phase === Phase.INTEGRATION_TEST_EXTERNAL) {
            return [
                Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION,
            ];
        }


        return []; // 他のフェーズでは特に必要なフェーズはない

    }
}