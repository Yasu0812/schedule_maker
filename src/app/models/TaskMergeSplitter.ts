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

        const totalDuration = duration.reduce((sum, d) => sum + d, 0);
        if (totalDuration !== task.duration) {
            throw new Error(`Total duration of split parts must equal the original task duration. Original: ${task.duration}, Split: ${totalDuration}`);
        }

        const tasks: Task[] = [];
        const taskIds = [task.id, ...duration.map(() => generateUUID())];
        duration.forEach((v, i) => {
            if (v > 0) {
                const newTask = new Task(taskIds[i], task.ticketId, task.ticketTitle, task.phase, v, task.taskInformation);
                tasks.push(newTask);
            }
        });
        return tasks;
    }

    public splitTaskByNumDurations(duration: number, num: number): number[] {
        if (num < 2) {
            return [duration]; // If num is less than 2, return the original duration as a single element array
        }
        const baseDuration = Math.floor(duration / num);
        const remainder = duration % num;
        const durations = Array<number>(num).fill(baseDuration);
        for (let i = 0; i < remainder; i++) {
            durations[i] += 1; // Distribute the remainder
        }

        return durations.filter(v => v > 0); // Filter out any zero durations

    }

    public splitTaskByNum(task: Task, num: number): Task[] {
        if (num < 2) {
            throw new Error("Number of splits must be at least 2");
        }
        const durations = this.splitTaskByNumDurations(task.duration, num);

        return this.splitTask(task, durations);

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
            totalDuration,
            tasks[0].taskInformation
        );

        return mergedTask;
    }

}