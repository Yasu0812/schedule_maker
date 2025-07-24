import { DateUtil } from "../common/DateUtil";
import { holidaysDate } from "../common/Holidays";

export class ScheduleConfiguration {

    private readonly _firstDate: Date;
    private readonly _lastDate: Date;
    private readonly _additionalHolidays: Date[];
    private readonly _dayList: Date[];
    private readonly _isShowHoliday: boolean;
    private readonly _duration: number;

    constructor(
        firstDate: Date | string,
        lastDate: Date | string,
        additionalHolidays: Date[],
        isShowHoliday: boolean,
    ) {
        this._firstDate = typeof firstDate === 'string' ? DateUtil.parseDate(firstDate) : new Date(firstDate);
        this._lastDate = typeof lastDate === 'string' ? DateUtil.parseDate(lastDate) : new Date(lastDate);
        this._additionalHolidays = [...additionalHolidays].sort((a, b) => a.getTime() - b.getTime())
        //TODO 追加休日が設定できるようになった場合、これを消去すること
        this._additionalHolidays = holidaysDate;
        this._isShowHoliday = isShowHoliday;
        const allDaylist = DateUtil.generateDayList(this._firstDate, this._lastDate);
        const normalDaylist = allDaylist.filter(
            (date) => {
                // 追加休日と休日を除外する
                if (date.getDay() === 0 || date.getDay() === 6) return false;
                return !this._additionalHolidays.some(holiday => holiday.getTime() === date.getTime());
            }
        );
        this._dayList = this._isShowHoliday ? allDaylist : normalDaylist;
        this._duration = this._dayList.length;

        const duration = Math.abs(this._lastDate.getTime() - this._firstDate.getTime());
        // if over 1 year, throw error
        if (duration > 365 * 24 * 60 * 60 * 1000) {
            throw new Error("The duration between first date and last date must not exceed one year.");
        }

    }

    get firstDate(): Date {
        return this._firstDate;
    }

    get firstDateStr(): string {
        return DateUtil.formatDate(this._firstDate);
    }

    get showFirstDate(): string {
        return DateUtil.formatDateShow(this._firstDate);
    }

    get lastDate(): Date {
        return this._lastDate;
    }

    get lastDateStr(): string {
        return DateUtil.formatDate(this._lastDate);
    }

    get showLastDate(): string {
        return DateUtil.formatDateShow(this._lastDate);
    }

    get additionalHolidays(): Date[] {
        return this._additionalHolidays;
    }

    get dayList(): Date[] {
        return this._dayList;
    }

    get isShowHoliday(): boolean {
        return this._isShowHoliday;
    }

    get duration(): number {
        return this._duration;
    }

    public updateDates(firstDate: Date | string, lastDate: Date | string) {
        return new ScheduleConfiguration(firstDate, lastDate, this._additionalHolidays, this._isShowHoliday);
    }

    public updateFirstDate(firstDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(firstDate, this._lastDate, this._additionalHolidays, this._isShowHoliday);
    }

    public updateLastDate(lastDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(this._firstDate, lastDate, this._additionalHolidays, this._isShowHoliday);
    }

    public updateAdditionalHolidays(holidays: Date[]): ScheduleConfiguration {
        return new ScheduleConfiguration(this._firstDate, this._lastDate, holidays, this._isShowHoliday);
    }

    public isExistingHoliday(date: Date): boolean {
        return this._additionalHolidays.some(holiday => holiday.getTime() === date.getTime());
    }

    public toggleShowHoliday(): ScheduleConfiguration {
        return new ScheduleConfiguration(
            this._firstDate,
            this._lastDate,
            this._additionalHolidays,
            !this._isShowHoliday
        );
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

    public getNextWorkingDay(
        date: Date,
    ): Date {
        const nextDate = new Date(date);
        do {
            nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        } while (this.isScheduleHoliday(nextDate, this._additionalHolidays));

        return nextDate;
    }

    public getPreviousWorkingDay(
        date: Date,
    ): Date {
        const previousDate = new Date(date);
        do {
            previousDate.setUTCDate(previousDate.getUTCDate() - 1);
        } while (this.isScheduleHoliday(previousDate, this._additionalHolidays));

        return previousDate;
    }

    public getWorkingDayCount(
        startDate: Date,
        endDate: Date,
    ): number {
        let count = 0;
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            if (!this.isScheduleHoliday(currentDate, this._additionalHolidays)) {
                count++;
            }
            currentDate.setUTCDate(currentDate.getUTCDate() + 1);
        }
        return count;
    }

    public getDayCount(
        startDate: Date,
        endDate: Date,
    ): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    public countWorkingDaysOrAllDays(
        startDate: Date,
        endDate: Date,
    ): number {
        if (this._isShowHoliday) {
            return this.getDayCount(startDate, endDate);
        } else {
            return this.getWorkingDayCount(startDate, endDate);
        }
    }

    static createDefaultConfiguration(): ScheduleConfiguration {
        const firstDate = DateUtil.getCurrentMonthFirstDate();
        const lastDate = DateUtil.getCurrentMonthLastDate();
        return new ScheduleConfiguration(firstDate, lastDate, [], true);
    }

}