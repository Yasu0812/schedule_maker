import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { isAfterPhase, PhaseEnum } from "../common/PhaseEnum";
import { CalendarCellTaskManager } from "./CalendarCellTask";
import { PhaseCalculator } from "./PhaseCalculator";
import { PlanedTask } from "./PlanedTask";
import { TaskManager } from "./TaskManager";


export class CalendarDayCalculator {

    private _phaseCalculator = new PhaseCalculator();

    public fastestAssignableDay(
        beforePhaseFinishDay: Date,
    ): Date {
        const fastestAssignableDay = DateUtil.getEndDateNoHoliday(beforePhaseFinishDay, 1);

        return fastestAssignableDay;
    }

    /**
     * 指定したチケットのフェーズの終了日を取得します。
     * 
     * @param ticketId 
     * @param calandarManager 
     * @param taskManager 
     * @param planedManager 
     * @param phase 
     * @returns 
     */
    public getTicketPhaseFinishDay(
        ticketId: UUID,
        calandarManager: CalendarCellTaskManager,
        taskManager: TaskManager,
        planedManager: PlanedTask,
        phase: PhaseEnum
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
            return DateUtil.getAddDate(calandarManager.firstDate, -1);
        }

        const maxFinishDay = DateUtil.getLatestDay(calendarCellsDay);
        return maxFinishDay;
    }
}