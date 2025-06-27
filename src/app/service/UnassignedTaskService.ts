import { UUID } from "../common/IdUtil";
import { FilterOptions } from "../components/task/TaskUnassignedBox";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import TaskFilter from "../models/TaskFilter";
import { TaskManager } from "../models/TaskManager";
import { Ticket } from "../models/Ticket";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";


export class UnassignedTaskService {

    private _unassignedTaskSelector = new UnassignedTaskSelector();

    private _taskFilter = new TaskFilter();


    /**
     * UnassignedTaskService は、未割り当てタスクの取得を担当するサービスクラスです。
     * 
     * このサービスは UnassignedTaskSelector を利用して、TaskManager 内のタスクから
     * 指定された条件に合致する未割り当てタスクを取得します。
     */
    public getUnassignedTasks(
        taskManager: TaskManager,
        planedTask: PlanedTask,
        ticketMap: Map<UUID, Ticket>,
        filterOptions: FilterOptions,
        exclusionTicketIds?: UUID[],
    ): Task[] {
        const unassignedTasks = this._unassignedTaskSelector.getUnassignedTasks(taskManager, planedTask, exclusionTicketIds);
        // フィルタリングを適用
        return this._taskFilter.filterTasks(unassignedTasks, ticketMap, filterOptions)
    }

}
