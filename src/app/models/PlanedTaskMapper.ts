import { DateUtil } from "../common/DateUtil";
import { CalendarCellTask } from "./CalendarCellTask";
import Member from "./Member";
import { MileStoneManager } from "./MileStoneManager";
import { PlanedTask } from "./PlanedTask";
import TaskAssignablePolicy from "./TaskAssignablePolicy";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";

export class PlanedTaskMapper {

    private _taskassignablePolicy: TaskAssignablePolicy = new TaskAssignablePolicy();

    public toCalender(
        memberList: Member[],
        tikcketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask,
        mileStoneManager: MileStoneManager
    ): Map<string, Map<string, CalendarCellTask>> {
        // key1: memberId, key2: date
        // value: CalendarCellTask
        const taskMap: Map<string, Map<string, CalendarCellTask>> = new Map<string, Map<string, CalendarCellTask>>();

        for (const member of memberList) {
            const taskMapForMember: Map<string, CalendarCellTask> = new Map<string, CalendarCellTask>();
            const assignedTaskList = planedTasks.getAssignedFromMemberId(member.id);

            for (const assignedTask of assignedTaskList) {
                const task = taskManager.getTask(assignedTask.taskId);
                if (!task) {
                    throw new Error(`Task with ID ${assignedTask.taskId} not found`);
                }

                const ticket = tikcketManager.getTicket(task.ticketId);
                if (!ticket) {
                    throw new Error(`Ticket with ID ${task.ticketId} not found`);
                }

                const startDate = assignedTask.startDay;
                const endDate = assignedTask.endDay;

                for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
                    const dateString = DateUtil.formatDate(date);
                    const isAssignable = this._taskassignablePolicy.isTaskAssignableDay(
                        task.id,
                        date,
                        planedTasks,
                        taskManager,
                        mileStoneManager,
                        member,
                        tikcketManager.getExclusiveTicketIds()
                    );
                    const cellTask = new CalendarCellTask(
                        ticket.title,
                        task.id,
                        dateString,
                        task.phase,
                        ticket.description,
                        isAssignable
                    );
                    taskMapForMember.set(dateString, cellTask);
                }
            }
            taskMap.set(member.id, taskMapForMember);
        }

        return taskMap;
    }
}