import { UUID } from "../common/IdUtil";
import { CalendarCellTask, CalendarCellTaskManager } from "./CalendarCellTask";
import { PlanedTask } from "./PlanedTask";
import { Task } from "./Task";
import { TaskManager } from "./TaskManager";
import { TicketManager } from "./Ticket";


export class ScheduleStateManager {

    private _calandarManager: CalendarCellTaskManager;
    private _taskManager: TaskManager;
    private _ticketManager: TicketManager;
    private _planedTaskManager: PlanedTask;

    constructor(
        calandarManager: CalendarCellTaskManager,
        taskManager: TaskManager,
        ticketManager: TicketManager,
        planedTaskManager: PlanedTask,
    ) {
        this._calandarManager = calandarManager;
        this._taskManager = taskManager;
        this._ticketManager = ticketManager;
        this._planedTaskManager = planedTaskManager;
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

    public static ScheduleStateManagerFactory(): ScheduleStateManager {
        const calandarManager = new CalendarCellTaskManager(["a", "b", "c", "d"], new Map<string, Map<string, CalendarCellTask>>(), new Date("2025-04-01"), new Date("2025-06-30"));
        const taskManager = new TaskManager(new Map<UUID, Task>());
        const ticketManager = new TicketManager([]);
        const planedTaskManager = new PlanedTask();

        return new ScheduleStateManager(
            calandarManager,
            taskManager,
            ticketManager,
            planedTaskManager,
        );
    }

}