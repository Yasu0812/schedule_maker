import { DateUtil } from "../common/DateUtil";
import { phaseNameMap } from "../common/PhaseEnum";
import { ScheduleStateManager } from "../models/ScheduleStateManager";

export class ScheduleCsvConverter {

    public toCsv(schedule: ScheduleStateManager): string {
        const calandar = schedule.calandarManager;
        const header = ["name", ...calandar.dayList.map(date => DateUtil.formatDateShow(date))];
        const memberMap = schedule.memberManager.memberMap;


        const rows = Array.from(memberMap).map(([id, name]) => {
            const line = calandar.getCalendarLine(id);
            const taskDescriptions = calandar.dayList.map(date => {
                const task = line.getTaskForDate(DateUtil.formatDate(date));
                return task ? `${task.taskName}#${phaseNameMap[task.taskPhase]}` : "";
            });
            return [name, ...taskDescriptions];
        });

        const csvContent = [header, ...rows].map(row => row.join(",")).join("\n");
        return csvContent;
    }

}