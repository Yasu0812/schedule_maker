import { UUID } from "../common/IdUtil";
import { AssignedTask } from "./AssignedTask";
import { CalendarCellTask, CalendarCellTaskManager } from "./CalendarCellTask";
import { MemberManager } from "./MemberManager";
import { MileStoneManager } from "./MileStoneManager";
import { PlanedTask } from "./PlanedTask";
import { ScheduleConfiguration } from "./ScheduleConfiguration";
import { Task } from "./Task";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";


export class ScheduleStateManager {

    private _calandarManager: CalendarCellTaskManager;
    private _taskManager: TaskManager;
    private _ticketManager: TicketManager;
    private _planedTaskManager: PlanedTask;
    private _memberManager: MemberManager;
    private _scheduleConfiguration: ScheduleConfiguration;
    private _mileStoneManager: MileStoneManager;

    constructor(
        calandarManager: CalendarCellTaskManager,
        taskManager: TaskManager,
        ticketManager: TicketManager,
        planedTaskManager: PlanedTask,
        memberManager: MemberManager,
        scheduleConfiguration: ScheduleConfiguration,
        mileStoneManager: MileStoneManager,
    ) {
        this._calandarManager = calandarManager;
        this._taskManager = taskManager;
        this._ticketManager = ticketManager;
        this._planedTaskManager = planedTaskManager;
        this._memberManager = memberManager;
        this._scheduleConfiguration = scheduleConfiguration;
        this._mileStoneManager = mileStoneManager;
    }

    get calandarManager(): CalendarCellTaskManager {
        return this._calandarManager;
    }

    get taskManager(): TaskManager {
        return this._taskManager;
    }

    get ticketManager(): TicketManager {
        return this._ticketManager;
    }

    get planedTaskManager(): PlanedTask {
        return this._planedTaskManager;
    }

    get memberManager(): MemberManager {
        return this._memberManager;
    }

    get scheduleConfiguration(): ScheduleConfiguration {
        return this._scheduleConfiguration;
    }

    get mileStoneManager(): MileStoneManager {
        return this._mileStoneManager;
    }

    public static ScheduleStateManagerFactory(firstDate: Date, lastDate: Date): ScheduleStateManager {
        const calandarManager = new CalendarCellTaskManager([], new Map<string, Map<string, CalendarCellTask>>(), firstDate, lastDate);
        const taskManager = new TaskManager(new Map<UUID, Task>());
        const ticketManager = new TicketManager([]);
        const planedTaskManager = new PlanedTask(new Map<UUID, AssignedTask>());
        const memberManager = new MemberManager(new Map<UUID, string>());
        const scheduleConfiguration = ScheduleConfiguration.createDefaultConfiguration();
        const mileStoneManager = new MileStoneManager();

        return new ScheduleStateManager(
            calandarManager,
            taskManager,
            ticketManager,
            planedTaskManager,
            memberManager,
            scheduleConfiguration,
            mileStoneManager
        );
    }

}