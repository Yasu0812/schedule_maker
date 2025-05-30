import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { isAfterPhase, PhaseEnum } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "./CalendarCellTask";
import { TaskManager } from "./TaskManager";


export class CalendarDayCalculator {

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

        const maxFinishDay = DateUtil.getLatestDay(calendarCellsDay);
        return maxFinishDay;
    }
}