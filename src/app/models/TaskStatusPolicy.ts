import { UUID } from "../common/IdUtil";
import { PhaseEnum, isBeforePhase } from "../common/PhaseEnum";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";

export class TaskStatusPolicy {

    private _unassignedTaskSelector = new UnassignedTaskSelector();


    /**
     * 指定されたチケットIDに関連するタスクが、指定されたフェーズより前にすべて割り当てられているかどうかを判定します。
     *
     * @param ticketId チェック対象のチケットID
     * @param phase 判定基準となるフェーズ
     * @param taskManager タスク管理オブジェクト
     * @param planedTask 計画されたタスク
     * @returns 指定されたチケットIDに関連し、かつ指定フェーズより前の未割り当てタスクが存在しない場合は true、それ以外は false
     */
    public isAllAssignedBeforePhase(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ) {
        const unassignedTasks = this._unassignedTaskSelector.getUnassignedTasks(taskManager, planedTask);
        const unassignedTaskFromTicketBeforePhase = unassignedTasks.every(task => {
            return task.ticketId !== ticketId || !isBeforePhase(task.phase, phase);
        });

        return unassignedTaskFromTicketBeforePhase;

    }
}