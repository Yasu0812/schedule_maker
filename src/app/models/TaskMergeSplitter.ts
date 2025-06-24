import { generateUUID } from '../common/IdUtil';
import { Task } from './Task';


export class TaskMergeSplitter {

    /**
     * タスクを分割するメソッド
     * @param task 分割するタスク
     * @param duration 分割後のタスクの所要日数
     * @returns 分割されたタスクの配列
     */
    public splitTask(task: Task, duration: number[]): Task[] {
        const tasks: Task[] = [];
        const taskIds = [task.id, ...duration.map(() => generateUUID())];
        duration.forEach((v, i) => {
            if (v > 0) {
                const newTask = new Task(taskIds[i], task.ticketId, task.ticketTitle, task.phase, v);
                tasks.push(newTask);
            }
        });
        return tasks;
    }

    /**
     * タスクを半分に分割するメソッド
     * @param task 分割するタスク
     * @returns 分割されたタスクの配列
     */
    public splitTaskByHalf(task: Task): Task[] {
        const halfDurationCeil = Math.ceil(task.duration / 2);
        const halfDurationFloor = Math.floor(task.duration / 2);
        return this.splitTask(task, [halfDurationCeil, halfDurationFloor]);

    }

    /**
     * 複数分割されたタスクを一つに統合するメソッド
     * @param tasks 統合するタスクの配列
     */
    public mergeTasks(tasks: Task[]): Task {

        if (tasks.length === 0) {
            throw new Error("No tasks to merge");
        }
        if (tasks.length === 1) {
            return tasks[0];
        }

        const uniqueTicketIds = new Set(tasks.map(task => task.ticketId));
        if (uniqueTicketIds.size > 1) {
            throw new Error("All tasks must have the same ticketId");
        }

        const uniquePhases = new Set(tasks.map(task => task.phase));
        if (uniquePhases.size > 1) {
            throw new Error("All tasks must have the same phase");
        }


        const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);
        const mergedTask = new Task(
            tasks[0].id,
            tasks[0].ticketId,
            tasks[0].ticketTitle,
            tasks[0].phase,
            totalDuration
        );

        return mergedTask;
    }

}