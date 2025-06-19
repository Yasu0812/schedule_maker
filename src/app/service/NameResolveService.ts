import { UUID } from "../common/IdUtil";
import { TaskManager } from "../models/TaskManager";
import { TaskResolver } from "../models/TaskResolver";
import { TicketManager } from "../models/Ticket";

export class NameResolveService {

    private _taskResolver: TaskResolver = new TaskResolver();

    /**
     * タスクIDからタスク名を解決する
     * @param taskId 
     * @param taskManager 
     * @returns タスク名
     * @throws {Error} タスクが見つからない場合
     */
    public resolveTaskName(taskId: UUID, ticketManager: TicketManager, taskManager: TaskManager): string {
        return this._taskResolver.resolveTaskName(taskId, ticketManager, taskManager);
    }
}