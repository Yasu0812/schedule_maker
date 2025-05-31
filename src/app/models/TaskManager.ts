import { Task } from "./Task";
import { Ticket } from "./Ticket";
import { PhaseEnum } from "../common/PhaseEnum";
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

    public addDurationToTask(
        ticketId: UUID,
        ticketTitle: string,
        phase: PhaseEnum,
        duration: number,
    ): TaskManager {
        if (duration <= 0) {
            throw new Error(`Duration must be greater than 0: ${duration}`);
        }
        const newTask = new Task(
            generateUUID(),
            ticketId,
            ticketTitle,
            phase,
            duration,
        );
        this.addTask(newTask);
        return this;
    }

    /**
     * 指定されたチケットの指定されたフェーズのタスクから、指定された時間を減算します。  
     * 期間が長いタスクから順に減算されます。
     * @param ticketId チケットID
     * @param phase フェーズ
     * @param duration 減算する時間
     * @returns TaskManager
     */
    public subDurationFromTask(
        ticketId: UUID,
        phase: PhaseEnum,
        duration: number,
    ): TaskManager {
        if (duration <= 0) {
            throw new Error(`Duration to subtract must be greater than 0: ${duration}`);
        }

        const taskList = this.getTaskFromTicketPhase(ticketId, phase);
        if (taskList.length === 0) {
            throw new Error(`Task not found for ticketId: ${ticketId}, phase: ${phase}`);
        }

        const taskSumDuration = taskList.reduce((sum, task) => sum + task.duration, 0);
        if (taskSumDuration < duration) {
            throw new Error(`Duration to subtract exceeds total task duration: ${taskSumDuration}`);
        }

        let substractedDuration = 0;
        while (substractedDuration < duration) {
            const task = taskList.sort((a, b) => a.duration - b.duration).pop();
            if (!task) {
                break;
            }
            if (task.duration > 0) {
                const newDuration = task.duration - 1;
                if (newDuration <= 0) {
                    this.removeTask(task.id);
                }
                else {
                    this.addTask(new Task(task.id, task.ticketId, task.tickeTitle, task.phase, newDuration));
                }
            }
            substractedDuration += 1;

        }
        return this;
    }

    /**
     * 指定されたチケットの指定されたフェーズのタスクに、指定された時間を追加または減算します。
     * * durationが正の値の場合は追加、負の値の場合は減算されます。
     * * ただし、durationが0の場合は何もしません。
     * @param ticketId 
     * @param ticketTitle 
     * @param phase 
     * @param duration 
     * @returns 
     */
    public addOrSubDurationToTask(
        ticketId: UUID,
        ticketTitle: string,
        phase: PhaseEnum,
        duration: number,
    ): TaskManager {
        if (duration > 0) {
            return this.addDurationToTask(ticketId, ticketTitle, phase, duration);
        } else if (duration < 0) {
            return this.subDurationFromTask(ticketId, phase, -duration);
        }
        return this;
    }

}
