import { AssignedTask } from "./AssignedTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { PhaseEnum } from "../common/PhaseEnum";
import { TaskResolver } from "./TaskResolver";
import { UUID } from "../common/IdUtil";

export class AssignedTaskSelector {

    private _taskResolver = new TaskResolver();

    /**
     * 割り当て済みのタスクとそのフェーズを取得します。  
     * phaseごとにグループ化され、各フェーズに対して割り当てられたタスクとそのフェーズが含まれます。
     * @param ticketId 
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public getAssignedTaskAndPhase(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): Map<PhaseEnum, { assignedTask: AssignedTask, phase: PhaseEnum }[]> {

        const assignedTasks = planedTask.getFromTicketId(ticketId).map(assignedTask =>
            this._taskResolver.resolveAssignedTaskWithPhase(assignedTask.taskId, taskManager, planedTask)
        );

        return Map.groupBy(assignedTasks, assignedTask => assignedTask.phase);

    }
}
