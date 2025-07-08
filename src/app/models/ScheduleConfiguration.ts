import { DateUtil } from "../common/DateUtil";
import { holidaysDate } from "../common/Holidays";

export class ScheduleConfiguration {

    private readonly _firstDate: Date;
    private readonly _lastDate: Date;
    private readonly _additionalHolidays: Date[];

    constructor(
        firstDate: Date | string,
        lastDate: Date | string,
        additionalHolidays: Date[]
    ) {
        this._firstDate = typeof firstDate === 'string' ? DateUtil.parseDate(firstDate) : new Date(firstDate);
        this._lastDate = typeof lastDate === 'string' ? DateUtil.parseDate(lastDate) : new Date(lastDate);
        this._additionalHolidays = [...additionalHolidays].sort((a, b) => a.getTime() - b.getTime())
        //TODO 追加休日が設定できるようになった場合、これを消去すること
        this._additionalHolidays = holidaysDate;

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

    public updateDates(firstDate: Date | string, lastDate: Date | string) {
        return new ScheduleConfiguration(firstDate, lastDate, this._additionalHolidays);
    }

    public updateFirstDate(firstDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(firstDate, this._lastDate, this._additionalHolidays);
    }

    public updateLastDate(lastDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(this._firstDate, lastDate, this._additionalHolidays);
    }

    public updateAdditionalHolidays(holidays: Date[]): ScheduleConfiguration {
        return new ScheduleConfiguration(this._firstDate, this._lastDate, holidays);
    }

    public isExistingHoliday(date: Date): boolean {
        return this._additionalHolidays.some(holiday => holiday.getTime() === date.getTime());
    }

    static createDefaultConfiguration(): ScheduleConfiguration {
        const firstDate = DateUtil.getCurrentMonthFirstDate();
        const lastDate = DateUtil.getCurrentMonthLastDate();
        return new ScheduleConfiguration(firstDate, lastDate, []);
    }

}