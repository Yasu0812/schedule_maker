import { UUID } from "crypto";
import { CalendarCellTask, CalendarCellTaskManager } from "../models/CalendarCellTask";
import { MemberManager } from "../models/MemberManager";
import { PlanedTask } from "../models/PlanedTask";
import { PlanedTaskMapper } from "../models/PlanedTaskMapper";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";

export class GetCalendarService {

    public getCalendar(
        memberIds: UUID[],
        taskMap: Map<string, Map<string, CalendarCellTask>>,
        firstDate: Date,
        lastDate: Date,
    ): CalendarCellTaskManager {
        return new CalendarCellTaskManager(memberIds, taskMap, firstDate, lastDate);
    }

    public fromPlanedDatas(
        firstDate: Date,
        lastDate: Date,
        memberManager: MemberManager,
        tikcketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask,

    ) {
        const planedTaskMapper = new PlanedTaskMapper().toCalender(
            firstDate,
            lastDate,
            memberManager.ids,
            tikcketManager,
            taskManager,
            planedTasks,
        );

        return this.getCalendar(memberManager.ids, planedTaskMapper, firstDate, lastDate);

    }
}   