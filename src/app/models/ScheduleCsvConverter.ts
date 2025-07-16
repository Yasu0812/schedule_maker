import { DateUtil } from "../common/DateUtil";
import { phaseNameMap } from "../common/PhaseEnum";
import DurationDayCalc from "./DurationDayCalc";
import { ScheduleStateManager } from "./ScheduleStateManager";

export class ScheduleCsvConverter {

    public toCsv(schedule: ScheduleStateManager): string {
        const calandar = schedule.calandarManager;
        const header = ["name", ...calandar.dayList.map(date => DateUtil.formatDateShow(date))];
        const memberMap = schedule.memberManager.memberMap;


        const rows = Array.from(memberMap).map(([id, member]) => {
            const line = calandar.getCalendarLine(id);

            const taskDescriptions = calandar.dayList.map(date => {
                const task = line.getTaskForDate(DateUtil.formatDate(date));
                const isHoliday = new DurationDayCalc().isScheduleHoliday(date, schedule.scheduleConfiguration.additionalHolidays);
                return task && !isHoliday ? `${task.taskName}#${phaseNameMap[task.taskPhase]}` : "";
            });
            return [member.name, ...taskDescriptions];
        });

        const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
        return csvContent;
    }

}