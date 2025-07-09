import { FilterOptions } from "../components/task/TaskUnassignedBox";
import { Task } from "./Task";

export default class TaskFilter {

    public filterTasks(tasks: Task[], filterOptions: FilterOptions): Task[] {
        return tasks.filter(task => {
            const taskTitle = task.ticketTitle;
            if (!taskTitle) return false; // Skip tasks without a title
            const matchesPhase = filterOptions.phase.length === 0 || filterOptions.phase.includes(task.phase);
            const matchesTitle = taskTitle.toLowerCase().includes(filterOptions.title.toLowerCase());
            return matchesPhase && matchesTitle;
        });
    }

}