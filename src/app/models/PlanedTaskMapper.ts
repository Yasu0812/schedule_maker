import { DateUtil } from "../common/DateUtil";
import { CalendarCellTask } from "./CalendarCellTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";

export class PlanedTaskMapper {

    public toCalender(
        firstDate: Date,
        lastDate: Date,
        memberList: string[],
        tikcketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask
    ): Map<string, Map<string, CalendarCellTask>> {
        // key1: memberId, key2: date
        // value: CalendarCellTask
        const taskMap: Map<string, Map<string, CalendarCellTask>> = new Map<string, Map<string, CalendarCellTask>>();

        for (const member of memberList) {
            const taskMapForMember: Map<string, CalendarCellTask> = new Map<string, CalendarCellTask>();
            const assignedTaskList = planedTasks.getAssignedFromMemberId(member);

            for (const assignedTask of assignedTaskList) {
                const task = taskManager.getTask(assignedTask.taskId);
                if (!task) {
                    throw new Error(`Task with ID ${assignedTask.taskId} not found`);
                }

                const ticket = tikcketManager.getTicket(task.ticketId);
                if (!ticket) {
                    throw new Error(`Ticket with ID ${task.ticketId} not found`);
                }

                const startDate = DateUtil.getAddDate(firstDate, assignedTask.startDayNum);
                const endDate = DateUtil.getAddDate(firstDate, assignedTask.startDayNum + assignedTask.duration);

                for (let date = new Date(firstDate); date <= lastDate; date.setDate(date.getDate() + 1)) {
                    if (date >= startDate && date < endDate) {
                        const dateString = DateUtil.formatDate(date);
                        const cellTask = new CalendarCellTask(
                            ticket.title,
                            task.id,
                            dateString,
                            task.phase,
                            ticket.description,
                        );
                        taskMapForMember.set(dateString, cellTask);
                    }
                }
            }
            taskMap.set(member, taskMapForMember);
        }

        return taskMap;
    }
}