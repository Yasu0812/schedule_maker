import { AssignmentStatus, AssignmentStatusEnum } from "../common/AssignmentStatusEnum";

export class TicketFinishedPolicy {

    public isTicketPlanned(
        assignmentStatuses: AssignmentStatusEnum[],
    ): boolean {
        return assignmentStatuses.some((status) => status === AssignmentStatus.FULL);
    }
}