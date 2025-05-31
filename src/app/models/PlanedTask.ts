import { DateUtil } from "../common/DateUtil";
import { generateUUID, UUID } from "../common/IdUtil";
import { AssignedTask, } from "./AssignedTask";

/**
 * 割り当て済みのタスクを管理するクラス  
 * タスクを割り当てることを、タスクを計画するという。
 * 計画されたタスクの管理を行う。
 * @param assignedTasks 割り当て済みのタスクの配列 key: taskId, value: AssignedTask
 */
export class PlanedTask {

    private _assignedTasks: Map<UUID, AssignedTask> = new Map<UUID, AssignedTask>();

    constructor() {

    }

    private get _list(): AssignedTask[] {
        return Array.from(this._assignedTasks.values());
    }

    public get(taskId: UUID | undefined): AssignedTask | undefined {
        if (!taskId) {
            return undefined;
        }
        return this._assignedTasks.get(taskId);

    }

    public getFromTicketId(ticketId: UUID): AssignedTask[] {
        const assignedTasks = this._list.filter(assignedTask => assignedTask.ticketId === ticketId);
        return assignedTasks;
    }

    public getList(taskId: Iterable<UUID>): AssignedTask[] {
        const assignedTasks = Array.from(taskId).map(id => this.get(id));
        return assignedTasks.filter(assignedTask => assignedTask !== undefined);
    }

    public getFromAssignedId(assignedId: string): AssignedTask | undefined {
        const assignedTask = this._list.find(assignedTask => assignedTask.id === assignedId);
        return assignedTask;
    }

    public getAssignedFromMemberId(memberId: string): AssignedTask[] {
        const assignedTasks = this._list.filter(assignedTask => assignedTask.memberId === memberId);
        return assignedTasks;
    }

    public assignTask(task: { id: UUID, ticketId: UUID }, memberId: string, startDay: Date, duration: number): PlanedTask {
        const assignedTask = new AssignedTask(generateUUID(), task.ticketId, task.id, memberId, startDay, duration);
        this._assignedTasks.set(task.id, assignedTask);

        return this;
    }

    public removeTask(taskId: UUID): void {
        this._assignedTasks.delete(taskId);
    }

    public updateTaskDuration(taskId: UUID, duration: number): PlanedTask {
        if (duration <= 0) {
            this.removeTask(taskId);
        } else {
            const assignedTask = this.get(taskId);
            if (assignedTask) {
                this._assignedTasks.set(taskId, new AssignedTask(
                    assignedTask.id,
                    assignedTask.ticketId,
                    assignedTask.taskId,
                    assignedTask.memberId,
                    assignedTask.startDay,
                    duration
                ));
            }
        }

        return this;
    }

    /**
     * 指定されたメンバーに対して、指定された期間がフリーかどうかを判定します。  
     * このメソッドはあくまで物理的に割り当て可能かどうかを判定するものであり、  
     * ビジネスロジックに基づく割り当て可能性の判定ではありません。  
     * @param memberId 
     * @param planTaskId 
     * @param startDay 
     * @param duration 
     * @returns 
     */
    public isFree(memberId: string, planTaskId: UUID, startDay: Date, duration: number): boolean {
        const endDay = DateUtil.getEndDateNoHoliday(startDay, duration - 1);

        return this._list.every(task => {
            const isSameTask = task.taskId === planTaskId;
            const isSameMember = task.memberId === memberId;
            const isOverlapping = (task.startDay <= endDay && task.endDay >= startDay);
            return isSameTask || !(isSameMember && isOverlapping);
        });
    }

}
