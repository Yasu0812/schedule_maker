import { UUID } from "../common/IdUtil";
import { FilterOptions } from "../components/task/TaskUnassignedBox";
import { Task } from "./Task";
import { Ticket } from "./Ticket";

export default class TaskFilter {

    public filterTasks(tasks: Task[], ticketMap: Map<UUID, Ticket>, filterOptions: FilterOptions): Task[] {
        return tasks.filter(task => {
            const taskTitle = ticketMap.get(task.ticketId)?.title;
            if (!taskTitle) return false; // Skip tasks without a title
            const matchesPhase = filterOptions.phase.length === 0 || filterOptions.phase.includes(task.phase);
            const matchesTitle = taskTitle.toLowerCase().includes(filterOptions.title.toLowerCase());
            return matchesPhase && matchesTitle;
        });
    }

}