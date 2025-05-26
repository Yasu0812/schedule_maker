import { AssignmentStatus, AssignmentStatusEnum } from "../common/AssignmentStatusEnum";
import { TaskProgressCalculator } from "./TaskProgressCalculator";

export class TaskFinishedPolicy {

    private readonly _taskProgressCalculator: TaskProgressCalculator = new TaskProgressCalculator();

    public getAssignmentStatus(
        ticketPhaseDuration: number,
        assignedDuration: number,
    ): AssignmentStatusEnum {
        if (assignedDuration === 0) {
            return AssignmentStatus.NONE;

        } else if (assignedDuration < 1) {
            return AssignmentStatus.PARTIAL;

        } else if (assignedDuration > ticketPhaseDuration) {
            return AssignmentStatus.EXCESS;

        } else {
            return AssignmentStatus.FULL;
        }
    }

}
