import { UUID } from "crypto";
import { AssignedTask } from "./AssignedTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { UnassignedTaskSelector } from "./UnassignedTaskSelector";
import { afterPhases, PhaseEnum, previousPhases } from "../common/PhaseEnum";
import { TaskResolver } from "./TaskResolver";

export class AssignedTaskSelector {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    private _taskResolver = new TaskResolver();

    /**
     * 割り当て済みのタスクのうち、本来は割り当てられないはずのタスクを取得します。
     * 割り当てられないかどうかの判定は別policyに委ねられています。
     * @param taskManager 
     * @param planedTask 
     * @returns 
     */
    public getUnassignableTasks(
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): AssignedTask[] {

        //TODO: 未実装
        throw new Error("getUnassignableTasks is not implemented yet");

        // const prePhases = previousPhases(phase);
        // const aftPhases = [phase, ...afterPhases(phase)];
        // const unassignedPreTasks = this._unassignedTaskSelector.getUnassignedTaskFromTicketIdAndPhases(ticketId, prePhases, taskManager, planedTask);

        // const afterPhaseAssigned = planedTask.getFromTicketId(ticketId).filter(assignedTask => {
        //     const resolvePhase = this._taskResolver.resolveAssignedTaskPhase(assignedTask.taskId, taskManager, planedTask);
        //     return aftPhases.includes(resolvePhase);
        // })

        // if (unassignedPreTasks.length > 0) {
        //     return afterPhaseAssigned;
        // }

        // return []

    }

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
