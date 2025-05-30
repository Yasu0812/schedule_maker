import { UUID } from "../common/IdUtil";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";

export default class TaskAssignablePolicy {
    /**
     * タスクが割り当て可能かどうかを判定します。  
     * あらゆるポリシーを考慮して、メンバーにタスクを割り当てることができるかどうかを判断します。  
     * このメソッドがtrueを返す限り、他の条件を一切考慮することなくタスクを割り当て可能です。  
     * 言い換えると、このメソッドは最後の砦であり、ここでtrueが返される場合は、
     * 他のすべてのポリシーが満たされていることを意味します。
     * @param memberId 割り当てるメンバーのID
     * @param taskId タスクのID
     * @param startDay 割り当て開始日
     * @param duration タスクの期間（日数）
     * @returns 割り当て可能な場合はtrue、そうでない場合はfalse
     */
    public isTaskAssignable(
        taskId: UUID,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        const phase = task.phase;

        // 前工程の終了日がstartDayより前であることを確認



        // カレンダー上の空きを確認
        const isFree = planedTask.isFree(memberId, taskId, startDay, task.duration);


        return true;
    }

    /**
     * タスクが強制的に割り当て可能かどうかを判定します。
     * 最も緩い制約の元で、タスクを割り当てることができるかどうかを判断します。
     * @param taskId 
     * @param memberId 
     * @param startDay 
     * @param planedTask 
     * @param taskManager 
     * @returns 
     */
    public isTaskAssignableForce(
        taskId: UUID,
        memberId: string,
        startDay: Date,
        planedTask: PlanedTask,
        taskManager: TaskManager
    ): boolean {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }

        // カレンダー上の空きを確認
        const isFree = planedTask.isFree(memberId, taskId, startDay, task.duration);

        return isFree;
    }
}