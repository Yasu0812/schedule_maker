import { PhaseEnum } from "../common/PhaseEnum";
import { Task } from "../models/Task";
import TaskFilter from "../models/TaskFilter";
import { FilterOptions } from "../types/FilterOptions";

export default class TaskFilterService {

    private _taskFilter: TaskFilter = new TaskFilter();

    public filterTasks(tasks: Task[], filterOptions: FilterOptions): Task[] {
        return this._taskFilter.filterTasks(tasks, filterOptions);
    }

    public isFiltered(
        task: {
            ticketTitle: string,
            phase: PhaseEnum,
        },
        filterOptions: FilterOptions
    ): boolean {

        return this._taskFilter.isFiltered(task, filterOptions);
    }
}