import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { CalendarCellTask } from "./CalendarCellTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";

export class PlanedTaskMapper {

    public toCalender(
        memberIdList: UUID[],
        tikcketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask
    ): Map<string, Map<string, CalendarCellTask>> {
        // key1: memberId, key2: date
        // value: CalendarCellTask
        const taskMap: Map<string, Map<string, CalendarCellTask>> = new Map<string, Map<string, CalendarCellTask>>();

        for (const memberId of memberIdList) {
            const taskMapForMember: Map<string, CalendarCellTask> = new Map<string, CalendarCellTask>();
            const assignedTaskList = planedTasks.getAssignedFromMemberId(memberId);

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

                //TODO date周りのクソ挙動を修正する new Dateは使わずに、DateUtilで標準時を扱うようにする
                for (let date = new Date(startDate); date <= new Date(endDate); date.setDate(date.getDate() + 1)) {
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
            taskMap.set(memberId, taskMapForMember);
        }

        return taskMap;
    }
}