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
import { MileStoneSerializable, MileStoneSerializableType } from "./MileStoneSerializable";
import { MileStone } from "../MileStone";
import { MileStoneManager } from "../MileStoneManager";
import Member from "../Member";
import { MemberSerializable, MemberSerializableType } from "./MemberSerializable";

type ScheduleStateJsonType = {
    configration: ScheduleConfigurationSerializableType;
    tickets: TicketSerializableType[];
    tasks: Task[];
    assignedTasks: Record<UUID, AssignedTaskSerializableType>;
    members: Record<UUID, MemberSerializableType>;
    mileStones: Record<UUID, MileStoneSerializableType>;
};

export class ScheduleStateJson {

    public static toJson(
        scheduleStateManager: ScheduleStateManager,
    ): string {
        const tickets = scheduleStateManager.ticketManager.getTicketList().map(ticket => TicketSerializable.serialize(ticket));
        const tasks = [...scheduleStateManager.taskManager.getTaskAll().values()];
        const assignedTasks = Object.fromEntries([...scheduleStateManager.planedTaskManager.getMap().entries()].map(([id, assignedTask]) => [id, AssignedTaskSerializable.serialize(assignedTask)]));
        const members = Object.fromEntries([...scheduleStateManager.memberManager.memberMap.entries()].map(([id, member]) => [id, MemberSerializable.serialize(member)]));
        const configration = scheduleStateManager.scheduleConfiguration;
        const configrationSerialized = ScheduleConfigurationSerializable.serialize(configration);
        const mileStones = Object.fromEntries([...scheduleStateManager.mileStoneManager.mileStones.entries()].map(([id, mileStone]) => [id, MileStoneSerializable.serialize(mileStone)]));


        return JSON.stringify({
            configration: configrationSerialized,
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members,
            mileStones: mileStones
        }, null, 2);
    }

    public static fromJson(json: string): ScheduleStateManager {
        const { configration, tickets, tasks, assignedTasks, members, mileStones } = this.jsonParse(json);
        const toManager = this.toManager(
            {
                configration,
                tickets,
                tasks,
                assignedTasks,
                members,
                mileStones
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
        const members = data.members as Record<UUID, MemberSerializableType>;
        const mileStones = data.mileStones as Record<UUID, MileStoneSerializableType>;

        return {
            configration: configration,
            tickets: tickets,
            tasks: tasks,
            assignedTasks: assignedTasks,
            members: members,
            mileStones: mileStones
        }
    }

    private static toManager(
        param: ScheduleStateJsonType
    ) {
        const { configration, tickets, tasks, assignedTasks, members, mileStones } = param;


        const ticketManager = new TicketManager(tickets.map(ticket => TicketSerializable.deserialize(ticket)));

        const taskManager = new TaskManager(new Map(tasks.map(task => [task.id, task])));

        const membersMap = new Map(Object.entries(members).map(([id, member]) => [id, MemberSerializable.deserialize(member)])) as Map<UUID, Member>;
        const memberManager = new MemberManager(membersMap);

        const scheduleConfiguration = ScheduleConfigurationSerializable.deserialize(configration);

        const assignedTasksMap = new Map(Object.entries(assignedTasks).map(([id, assignedTask]) => [id, AssignedTaskSerializable.deserialize(assignedTask)])) as Map<UUID, AssignedTask>;
        const planedTaskManager = new PlanedTask(assignedTasksMap);

        const mileStoneMap = new Map(Object.entries(mileStones).map(([id, mileStone]) => [id, MileStoneSerializable.deserialize(mileStone)])) as Map<UUID, MileStone>;
        const mileStoneManager = new MileStoneManager(mileStoneMap);

        const planedTaskMapper = new PlanedTaskMapper().toCalender(
            memberManager.members,
            ticketManager,
            taskManager,
            planedTaskManager,
            mileStoneManager
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
            scheduleConfiguration,
            mileStoneManager
        );
    }
}