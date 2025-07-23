import { UUID } from "../common/IdUtil";
import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import TaskFilter from "../models/TaskFilter";
import { TaskManager } from "../models/TaskManager";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";
import { FilterOptions } from "../types/FilterOptions";


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
        filterOptions: FilterOptions,
        ticketId?: UUID,
        exclusionTicketIds?: UUID[],
    ): Task[] {
        const unassignedTasks = this._unassignedTaskSelector.getUnassignedTasks(taskManager, planedTask, ticketId, exclusionTicketIds);
        // フィルタリングを適用
        return this._taskFilter.filterTasks(unassignedTasks, filterOptions)
    }

}
