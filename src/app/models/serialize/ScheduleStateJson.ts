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
import { PlanedTaskMapper } from "../PlanedTaskMapper";
import { AssignedTaskSerializable, AssignedTaskSerializableType } from "./AssignedTaskSerializable";
import { ScheduleConfigurationSerializable, ScheduleConfigurationSerializableType } from "./ScheduleConfigurationSerializable";

type ScheduleStateJsonType = {
    configration: ScheduleConfigurationSerializableType;
    tickets: TicketSerializableType[];
    tasks: Task[];
    assignedTasks: Record<UUID, AssignedTaskSerializableType>;
    members: Record<UUID, string>;
};

export class ScheduleStateJson {

    public static toJson(
        scheduleStateManager: ScheduleStateManager,
    ): string {
        const tickets = scheduleStateManager.ticketManager.getTicketList().map(ticket => TicketSerializable.serialize(ticket));
        const tasks = [...scheduleStateManager.taskManager.getTaskAll().values()];
        const assignedTasks = Object.fromEntries([...scheduleStateManager.planedTaskManager.getMap().entries()].map(([id, assignedTask]) => [id, AssignedTaskSerializable.serialize(assignedTask)]));
        const members = Object.fromEntries(scheduleStateManager.memberManager.memberMap);
        const configration = scheduleStateManager.scheduleConfiguration;
        const configrationSerialized = ScheduleConfigurationSerializable.serialize(configration);


        return JSON.stringify({
            configration: configrationSerialized,
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members
        }, null, 2);
    }

    public static fromJson(json: string): ScheduleStateManager {
        const { configration, tickets, tasks, assignedTasks, members } = this.jsonParse(json);
        const toManager = this.toManager(
            {
                configration,
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

        const configration = data.configration;
        const tickets = data.tickets as TicketSerializableType[];
        const tasks = data.tasks as Task[];
        const assignedTasks = data.assignedTasks as Record<UUID, AssignedTaskSerializableType>;
        const members = data.members as Record<UUID, string>;

        return {
            configration: configration,
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members
        }
    }

    private static toManager(
        param: ScheduleStateJsonType
    ) {
        const { configration, tickets, tasks, assignedTasks, members } = param;


        const ticketManager = new TicketManager(tickets.map(ticket => TicketSerializable.deserialize(ticket)));

        const taskManager = new TaskManager(new Map(tasks.map(task => [task.id, task])));

        const membersMap = new Map(Object.entries(members)) as Map<UUID, string>;
        const memberManager = new MemberManager(membersMap);

        const scheduleConfiguration = ScheduleConfigurationSerializable.deserialize(configration);

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
            scheduleConfiguration.firstDate,
            scheduleConfiguration.lastDate,
        )

        return new ScheduleStateManager(
            calendar,
            taskManager,
            ticketManager,
            planedTaskManager,
            memberManager,
            scheduleConfiguration
        );
    }
}