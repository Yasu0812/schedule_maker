import { UUID } from "@/app/common/IdUtil";
import { AssignedTask } from "../AssignedTask";
import { CalendarCellTaskManager } from "../CalendarCellTask";
import { MemberManager } from "../MemberManager";
import { PlanedTask } from "../PlanedTask";
import { ScheduleStateManager } from "../ScheduleStateManager";
import { Task } from "../Task";
import { TaskManager } from "../TaskManager";
import { TicketManager } from "../Ticket";
import { TicketSerializable, TicketSerializableType } from "./TicketSerializable";
import { DateUtil } from "@/app/common/DateUtil";
import { PlanedTaskMapper } from "../PlanedTaskMapper";
import { AssignedTaskSerializable, AssignedTaskSerializableType } from "./AssignedTaskSerializable";

type ScheduleStateJsonType = {
    startDateStr: string;
    endDateStr: string;
    tickets: TicketSerializableType[];
    tasks: Task[];
    assignedTasks: Record<UUID, AssignedTaskSerializableType>;
    members: Record<UUID, string>;
};

export class ScheduleStateJson {

    public static toJson(
        scheduleStateManager: ScheduleStateManager,
    ): string {
        const startDate = scheduleStateManager.calandarManager.firstDate;
        const endDate = scheduleStateManager.calandarManager.lastDate;
        const tickets = scheduleStateManager.ticketManager.getTicketList().map(ticket => TicketSerializable.serialize(ticket));
        const tasks = [...scheduleStateManager.taskManager.getTaskAll().values()];
        const assignedTasks = Object.fromEntries([...scheduleStateManager.planedTaskManager.getMap().entries()].map(([id, assignedTask]) => [id, AssignedTaskSerializable.serialize(assignedTask)]));
        const members = Object.fromEntries(scheduleStateManager.memberManager.memberMap);


        return JSON.stringify({
            startDate: DateUtil.formatDate(startDate),
            endDate: DateUtil.formatDate(endDate),
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members
        }, null, 2);
    }

    public static fromJson(json: string): ScheduleStateManager {
        const { startDateStr, endDateStr, tickets, tasks, assignedTasks, members } = this.jsonParse(json);
        const toManager = this.toManager(
            {
                startDateStr,
                endDateStr,
                tickets,
                tasks,
                assignedTasks,
                members
            }
        );


        return toManager;
    }


    private static jsonParse(json: string): ScheduleStateJsonType {
        const data = JSON.parse(json);

        const startDate = data.startDate;
        const endDate = data.endDate;
        const tickets = data.tickets as TicketSerializableType[];
        const tasks = data.tasks as Task[];
        const assignedTasks = data.assignedTasks as Record<UUID, AssignedTaskSerializableType>;
        const members = data.members as Record<UUID, string>;

        return {
            startDateStr: startDate,
            endDateStr: endDate,
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members
        }
    }

    private static toManager(
        param: ScheduleStateJsonType
    ) {
        const { startDateStr, endDateStr, tickets, tasks, assignedTasks, members } = param;

        const startDate = DateUtil.parseDate(startDateStr);
        const endDate = DateUtil.parseDate(endDateStr);

        const ticketManager = new TicketManager(tickets.map(ticket => TicketSerializable.deserialize(ticket)));

        const taskManager = new TaskManager(new Map(tasks.map(task => [task.id, task])));

        const membersMap = new Map(Object.entries(members)) as Map<UUID, string>;
        const memberManager = new MemberManager(membersMap);

        const assignedTasksMap = new Map(Object.entries(assignedTasks).map(([id, assignedTask]) => [id, AssignedTaskSerializable.deserialize(assignedTask)])) as Map<UUID, AssignedTask>;
        const planedTaskManager = new PlanedTask(assignedTasksMap);

        const planedTaskMapper = new PlanedTaskMapper().toCalender(
            memberManager.ids,
            ticketManager,
            taskManager,
            planedTaskManager,
        );

        const calendar = new CalendarCellTaskManager(
            memberManager.ids,
            planedTaskMapper,
            startDate,
            endDate,
        )

        return new ScheduleStateManager(
            calendar,
            taskManager,
            ticketManager,
            planedTaskManager,
            memberManager
        );
    }
}