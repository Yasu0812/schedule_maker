import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { TicketAssignStatusEnum } from "../common/TicketAssignStatusEnum";
import { PhaseStatusPolicy } from "../models/PhaseStatusPolicy";
import { PlanedTask } from "../models/PlanedTask";
import { TaskManager } from "../models/TaskManager";
import { TicketFinishedPolicy } from "../models/TicketFinisedPolicy";

export class PlanningStatusService {

    private _ticketFinishedPolicy: TicketFinishedPolicy = new TicketFinishedPolicy();

    private _phaseStatusPolicy: PhaseStatusPolicy = new PhaseStatusPolicy();


    public isFinishedBeforePhaseWithDay(
        ticketId: UUID,
        phase: PhaseEnum,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        startDay: Date,
    ) {

        return this._ticketFinishedPolicy.isFinishedBeforePhaseWithDay(
            ticketId,
            phase,
            taskManager,
            planedTask,
            startDay
        );

    }

    public getTicketPhaseStatuses(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
    ): Map<PhaseEnum, TicketAssignStatusEnum> {

        return this._phaseStatusPolicy.getTicketAssignStatuses(
            ticketId,
            taskManager,
            planedTask
        );
    }

}