import { Task } from "./Task";
import { Ticket } from "./Ticket";
import { PhaseEnum, previousPhase } from "../common/PhaseEnum";
import { generateUUID, UUID } from "../common/IdUtil";

/**
 * タスクの管理を行うクラス。
 * @param taskList タスクのリスト
 * @param taskMap タスクのIDをキーに、タスクを値に持つMap
 */

export class TaskManager {

    constructor(
        private _taskMap: Map<UUID, Task>,
    ) { }

    /**
     * TaskManagerを生成するファクトリメソッド。  
     * チケットから、タスクを生成する。  
     * このメソッドで作成されたTaskManagerは、  
     * 受け取ったticketListを分割しない状態で保持する。  
     * @param ticketList チケットのリスト
     * @returns TaskManager
     */
    public static TaskManagerFactory(
        ticketList: Iterable<Ticket>,
    ): TaskManager {
        const taskMap: Map<UUID, Task> = new Map<UUID, Task>();
        for (const ticket of ticketList) {
            ticket.phases.forEach(phase => {
                const taskId = generateUUID();
                taskMap.set(taskId, new Task(taskId, ticket.id, ticket.title, phase.phase, phase.duration));
            });
        }
        return new TaskManager(taskMap);
    }

    public addTask(task: Task): TaskManager {
        this._taskMap.set(task.id, task);
        return this;
    }

    public addTaskFromTicket(ticket: Ticket): TaskManager {
        ticket.phases.forEach(phase => {
            const taskId = generateUUID();
            this._taskMap.set(taskId, new Task(taskId, ticket.id, ticket.title, phase.phase, phase.duration));
        });
        return this;
    }

    public addTaskList(taskList: Iterable<Task>): TaskManager {
        for (const task of taskList) {
            this.addTask(task);
        }
        return this;
    }

    public removeTask(taskId: UUID): TaskManager {
        this._taskMap.delete(taskId);
        return this;
    }

    public removeTasks(taskIds: UUID[]): TaskManager {
        taskIds.forEach(id => this._taskMap.delete(id));
        return this;
    }

    public removeTasksFromTicketId(ticketId: UUID): TaskManager {
        const taskList = this.getTaskFromTicketId(ticketId);
        taskList.forEach(task => {
            this._taskMap.delete(task.id);
        });
        return this;
    }

    public getTask(id: UUID | undefined): Task | undefined {
        if (!id) {
            return undefined;
        }
        return this._taskMap.get(id);
    }

    public getTaskList(ids: UUID[]): Task[] {
        const taskList: Task[] = [];
        ids.forEach(id => {
            const task = this._taskMap.get(id);
            if (task) {
                taskList.push(task);
            }
        });
        return taskList;
    }

    public getTaskFromTicketId(ticketId: string): Task[] {
        const taskList: Task[] = [];
        this._taskMap.forEach(task => {
            if (task.ticketId === ticketId) {
                taskList.push(task);
            }
        });
        return taskList;
    }

    public getTaskFromTicketPhase(ticketId: string, phase: PhaseEnum): Task[] {
        const taskList: Task[] = [];
        this._taskMap.forEach(task => {
            if (task.ticketId === ticketId && task.phase === phase) {
                taskList.push(task);
            }
        });
        return taskList;
    }

    public getTaskAll(): Map<UUID, Task> {
        return this._taskMap;
    }

    public getTaskIds(): UUID[] {
        return Array.from(this._taskMap.keys());
    }

    public getTaskFromTicketPrePhase(
        ticketId: UUID,
        phase: PhaseEnum,
    ): {
        taskList: Task[],
        prePhase: PhaseEnum | undefined,
    } {
        const prePhase = previousPhase(phase);
        if (!prePhase) {
            return { taskList: [], prePhase: undefined };
        }

        const preTaskList = this.getTaskFromTicketPhase(ticketId, prePhase);
        if (preTaskList.length === 0) {
            return this.getTaskFromTicketPrePhase(ticketId, prePhase);
        }

        return { taskList: preTaskList, prePhase: prePhase };
    }

    public changeTaskDuration(
        taskId: UUID,
        newDuration: number,
    ): { taskManager: TaskManager, diffDuration: number } {
        if (newDuration < 0) {
            throw new Error(`Duration must be greater than 0: ${newDuration}`);
        }
        const task = this._taskMap.get(taskId);
        if (!task) {
            throw new Error(`Task not found for taskId: ${taskId}`);
        }

        const diffDuration = newDuration - task.duration;

        if (diffDuration === 0) {
            return { taskManager: this, diffDuration: 0 };
        }

        this.removeTask(taskId);
        if (newDuration > 0) {
            const newTask = new Task(task.id, task.ticketId, task.ticketTitle, task.phase, newDuration);
            this.addTask(newTask);
        }

        return { taskManager: this, diffDuration: diffDuration };
    }

    public incrementTaskDuration(
        taskId: UUID,
    ): TaskManager {
        const task = this._taskMap.get(taskId);
        if (!task) {
            throw new Error(`Task not found for taskId: ${taskId}`);
        }

        const newDuration = task.duration + 1;
        return this.changeTaskDuration(taskId, newDuration).taskManager;
    }

    public decrementTaskDuration(
        taskId: UUID,
    ): TaskManager {
        const task = this._taskMap.get(taskId);
        if (!task) {
            throw new Error(`Task not found for taskId: ${taskId}`);
        }

        if (task.duration <= 0) {
            throw new Error(`Cannot decrement duration below 0 for taskId: ${taskId}`);
        }

        const newDuration = task.duration - 1;
        return this.changeTaskDuration(taskId, newDuration).taskManager;
    }

    /**
     * 指定されたチケットIDとフェーズのタスクの合計時間を計算します。
     * @param ticketId チケットID
     * @param phase フェーズ
     * @returns 合計時間
     */
    public sumDurationFromTicketIdWithPhase(
        ticketId: UUID,
        phase: PhaseEnum,
    ): number {
        const taskList = this.getTaskFromTicketPhase(ticketId, phase);
        return taskList.reduce((sum, task) => sum + task.duration, 0);
    }

}
