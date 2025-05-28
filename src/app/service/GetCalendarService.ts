import { CalendarCellTask, CalendarCellTaskManager } from "../models/CalendarCellTask";
import { PlanedTask } from "../models/PlanedTask";
import { PlanedTaskMapper } from "../models/PlanedTaskMapper";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";

export class GetCalendarService {

    public getCalendar(
        memberList: string[],
        taskMap: Map<string, Map<string, CalendarCellTask>>,
        firstDate: Date,
        lastDate: Date,
    ): CalendarCellTaskManager {
        return new CalendarCellTaskManager(memberList, taskMap, firstDate, lastDate);
    }

    public fromPlanedDatas(
        firstDate: Date,
        lastDate: Date,
        memberList: string[],
        tikcketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask,

    ) {
        const planedTaskMapper = new PlanedTaskMapper().toCalender(
            firstDate,
            lastDate,
            memberList,
            tikcketManager,
            taskManager,
            planedTasks,
        );

        return this.getCalendar(memberList, planedTaskMapper, firstDate, lastDate);

    }
}   