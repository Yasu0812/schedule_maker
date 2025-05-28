import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { isAfterPhase, isBeforePhase, PhaseEnum } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "./CalendarCellTask";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";
import { TaskResolver } from "./TaskResolver";
import { TaskStatusPolicy } from "./TaskStatusPolicy";


export class CalendarDayCalculator {

    private _taskResolver: TaskResolver = new TaskResolver();
    private _taskStatusPolicy: TaskStatusPolicy = new TaskStatusPolicy();

    public getBeforePhaseFinishDay(
        taskId: UUID,
        planedTask: PlanedTask,
        taskManager: TaskManager
    ): Date | undefined {
        const task = taskManager.getTask(taskId);
        if (!task) {
            throw new Error(`Task with ID ${taskId} not found`);
        }
        const phase = task.phase;
        const ticketId = task.ticketId;

        const isAllAssignedBeforePhase = this._taskStatusPolicy.isAllAssignedBeforePhase(
            ticketId,
            phase,
            taskManager,
            planedTask
        );

        if (!isAllAssignedBeforePhase) {
            return undefined;
        }

        const assignedTasks = planedTask.getFromTicketId(ticketId);
        const beforePhaseTasks = assignedTasks.filter(assignedTask => {
            const assignedTaskPhase = this._taskResolver.resolveAssignedTaskPhase(
                assignedTask.taskId,
                taskManager,
                planedTask
            );
            return isBeforePhase(assignedTaskPhase, phase);
        });

        const beforePhaseFinishDays = beforePhaseTasks.map(assignedTask => {
            return assignedTask.endDay;
        });

        if (beforePhaseFinishDays.length === 0) {
            return undefined;
        }

        const maxFinishDay = new Date(Math.max(...beforePhaseFinishDays.map(day => day.getTime())));

        return maxFinishDay;

    }


    public fastestAssignableDay(
        beforePhaseFinishDay: Date,
    ): Date {
        const fastestAssignableDay = DateUtil.getEndDateNoHoliday(beforePhaseFinishDay, 1);

        return fastestAssignableDay;
    }

    public getTicketPhaseFinishDay(
        ticketId: UUID,
        calandarManager: CalendarCellTaskManager,
        taskManager: TaskManager,
        phase: PhaseEnum | undefined
    ) {

        if (!phase) {
            return DateUtil.getAddDate(calandarManager.firstDate, -1);
        }

        const ticketTasks = taskManager.getTaskFromTicketId(ticketId);
        const calendarCellsDay = calandarManager.getAllCell()
            .filter(cell => cell.taskId && ticketTasks.some(task => task.id === cell.taskId) && !isAfterPhase(cell.taskPhase, phase))
            .map(cell => cell.taskDate)
            .map(dateStr => DateUtil.parseDate(dateStr));

        if (calendarCellsDay.length === 0) {
            return undefined;
        }

        const maxFinishDay = new Date(Math.max(...calendarCellsDay.map(day => day.getTime())));
        return maxFinishDay;
    }
}