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

    public get(taskId: UUID): AssignedTask | undefined {
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

    public assignTask(task: { id: UUID, ticketId: UUID, duration: number }, memberId: string, startDayNum: number): PlanedTask {
        const endDayNum = startDayNum + task.duration;
        const assignedTask = new AssignedTask(generateUUID(), task.ticketId, task.id, memberId, startDayNum, endDayNum - 1);
        this._assignedTasks.set(task.id, assignedTask);

        return this;
    }

    public removeTask(taskId: UUID): void {
        this._assignedTasks.delete(taskId);
    }

    public isTaskAssingnable(memberId: string, planId: UUID, startDayNum: number, endDayNum: number): boolean {
        const planTask = this.get(planId);
        return this._list.every(task => {
            const isSameTask = task.taskId === planTask?.taskId;
            const isSameMember = task.memberId === memberId;
            const isOverlapping = (task.startDayNum <= endDayNum && task.endDayNum >= startDayNum);
            return isSameTask || !(isSameMember && isOverlapping);
        });
    }

}
