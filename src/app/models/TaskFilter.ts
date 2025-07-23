import { PhaseEnum } from "../common/PhaseEnum";
import { FilterOptions } from "../types/FilterOptions";
import { Task } from "./Task";

export default class TaskFilter {

    public filterTasks(tasks: Task[], filterOptions: FilterOptions): Task[] {
        return tasks.filter(task => {
            return this.isFiltered(task, filterOptions);
        });
    }

    public isFiltered(
        task: {
            ticketTitle: string,
            phase: PhaseEnum,
        },
        filterOptions: FilterOptions
    ): boolean {
        const taskTitle = task.ticketTitle;
        const matchesPhase = filterOptions.phase.length === 0 || filterOptions.phase.includes(task.phase);
        const matchesTitle = taskTitle.toLowerCase().includes(filterOptions.title.toLowerCase());
        return (matchesPhase && matchesTitle);
    }

}