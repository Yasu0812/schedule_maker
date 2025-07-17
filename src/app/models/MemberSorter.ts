import { UUID } from "../common/IdUtil";
import { MemberManager } from "./MemberManager";
import { PlanedTask } from "./PlanedTask";
import { ProgressCalculator } from "./ProgressCalculator";
import { TaskManager } from "./TaskManager";

export class MemberSorter {

    private _progressCalculator = new ProgressCalculator();

    public sortByProgress(
        ticketId: UUID,
        taskManager: TaskManager,
        planedTask: PlanedTask,
        memberManager: MemberManager,

    ) {
        const members = memberManager.members;
        const idDurationMap = new Map<UUID, number>();
        members.forEach(member => {
            const progress = this._progressCalculator.sumDuration(member.id, ticketId, taskManager, planedTask);
            idDurationMap.set(member.id, progress);
        });
        const sortedMembers = members.sort((a, b) => {
            const progressA = idDurationMap.get(a.id) || 0;
            const progressB = idDurationMap.get(b.id) || 0;
            return progressB - progressA; // Sort in descending order
        });
        return sortedMembers;
    }



}