import { UUID } from "crypto";
import { CalendarCellTask, CalendarCellTaskManager } from "../models/CalendarCellTask";
import { MemberManager } from "../models/MemberManager";
import { PlanedTask } from "../models/PlanedTask";
import { PlanedTaskMapper } from "../models/PlanedTaskMapper";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";
import { MileStoneManager } from "../models/MileStoneManager";

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
        ticketManager: TicketManager,
        taskManager: TaskManager,
        planedTasks: PlanedTask,
        mileStoneManager: MileStoneManager,

    ) {
        const planedTaskMapper = new PlanedTaskMapper().toCalender(
            memberManager.members,
            ticketManager,
            taskManager,
            planedTasks,
            mileStoneManager
        );

        return this.getCalendar(memberManager.ids, planedTaskMapper, firstDate, lastDate);

    }
}   