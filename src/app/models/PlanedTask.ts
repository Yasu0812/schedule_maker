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

    constructor(
        assignedTasks: Map<UUID, AssignedTask>
    ) {
        this._assignedTasks = assignedTasks;
    }

    private get _list(): AssignedTask[] {
        return Array.from(this._assignedTasks.values());
    }

    public get assignedTaskIds(): Set<UUID> {
        return new Set(this._assignedTasks.values().map(assignedTask => assignedTask.id));
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

    public getAll(): AssignedTask[] {
        return this._list;
    }

    public getMap(): Map<UUID, AssignedTask> {
        return this._assignedTasks;
    }

    public getFromAssignedId(assignedId: string): AssignedTask | undefined {
        const assignedTask = this._list.find(assignedTask => assignedTask.id === assignedId);
        return assignedTask;
    }

    public getAssignedFromMemberId(memberId: UUID): AssignedTask[] {
        const assignedTasks = this._list.filter(assignedTask => assignedTask.memberId === memberId);
        return assignedTasks;
    }

    public getProgressingTickets(memberId: UUID): UUID[] {
        return Array.from(new Set(this.getAssignedFromMemberId(memberId).map(assignedTask => assignedTask.ticketId)));
    }

    public getProgressingTasksFromTicketId(memberId: UUID, ticketId: UUID): AssignedTask[] {
        const assignedTasks = this.getAssignedFromMemberId(memberId);
        return assignedTasks.filter(assignedTask => assignedTask.ticketId === ticketId);
    }

    public isProgressing(memberId: UUID, ticketId: UUID): boolean {
        const assignedTasks = this.getAssignedFromMemberId(memberId);
        return assignedTasks.some(assignedTask => assignedTask.ticketId === ticketId);

    }

    public removeFromMemberId(memberId: UUID): PlanedTask {
        const assignedTasks = this.getAssignedFromMemberId(memberId);
        assignedTasks.forEach(assignedTask => {
            this.removeTask(assignedTask.taskId);
        });
        return this;
    }

    public assignTask(task: { id: UUID, ticketId: UUID }, memberId: UUID, startDay: Date, endDay: Date): PlanedTask {
        const assignId = generateUUID()
        const assignedTask = new AssignedTask(assignId, task.ticketId, task.id, memberId, startDay, endDay);
        this._assignedTasks.set(task.id, assignedTask);

        return this;
    }

    public removeTask(taskId: UUID): void {
        this._assignedTasks.delete(taskId);
    }

    public removeTaskFromTicketId(taskId: UUID): PlanedTask {
        const assignedTasks = this.getFromTicketId(taskId);
        assignedTasks.forEach(assignedTask => {
            this._assignedTasks.delete(assignedTask.taskId);
        });

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
    public isFree(
        memberId: UUID,
        planTaskId: UUID,
        taskStartDay: Date,
        taskEndDay: Date,
    ): boolean {
        return this._list.every(task => {
            const isSameTask = task.taskId === planTaskId;
            const isSameMember = task.memberId === memberId;
            const isOverlapping = (task.startDay <= taskEndDay && task.endDay >= taskStartDay);
            return isSameTask || !(isSameMember && isOverlapping);
        });
    }

}
