import { PlanedTask } from "../models/PlanedTask";
import { Task } from "../models/Task";
import { TaskManager } from "../models/TaskManager";
import { UnassignedTaskSelector } from "../models/UnassignedTaskSelector";


export class UnassignedTaskService {

    private _unassignedTaskSelector = new UnassignedTaskSelector();


    public getUnassignedTasks(
        taskManager: TaskManager,
        planedTask: PlanedTask
    ): Task[] {
        return this._unassignedTaskSelector.getUnassignedTasks(taskManager, planedTask);
    }

}
