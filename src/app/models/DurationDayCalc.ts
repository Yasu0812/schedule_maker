import { DateUtil } from "../common/DateUtil";

export default class DurationDayCalc {

    public getEndDate(
        startDate: Date,
        duration: number,
        additionalHolidays: Date[],
        includeHolidays: boolean = false
    ): Date {
        const date = new Date(startDate);
        const newDate = new Date(date);
        const addDay = duration - 1; // duration is inclusive, so we subtract 1 to get the number of days to add
        let addedDays = 0;

        while (addedDays < addDay) {
            newDate.setUTCDate(newDate.getUTCDate() + 1);
            if (!this.isScheduleHoliday(newDate, additionalHolidays) || includeHolidays) {
                addedDays++;
            }
        }

        return newDate;
    }

    public isScheduleHoliday(
        date: Date,
        additionalHolidays: Date[]
    ): boolean {
        const d = new Date(date);

        // Check if the day is a weekend
        if (DateUtil.isHoliday(d)) {
            return true;
        }

        // Check if the date is in the additional holidays
        for (const holiday of additionalHolidays) {
            if (DateUtil.isSameDay(d, holiday)) {
                return true;
            }
        }

        return false;
    }

}