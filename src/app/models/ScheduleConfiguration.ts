import { DateUtil } from "../common/DateUtil";

export class ScheduleConfiguration {

    private readonly _firstDate: Date;
    private readonly _lastDate: Date;

    constructor(firstDate: Date | string, lastDate: Date | string) {

        this._firstDate = typeof firstDate === 'string' ? DateUtil.parseDate(firstDate) : new Date(firstDate);
        this._lastDate = typeof lastDate === 'string' ? DateUtil.parseDate(lastDate) : new Date(lastDate);

        // // Ensure the first date is before the last date
        // if (this._firstDate > this._lastDate) {
        //     throw new Error("First date must be before last date.");
        // }

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

    public updateDates(firstDate: Date | string, lastDate: Date | string) {
        return new ScheduleConfiguration(firstDate, lastDate);
    }

    public updateFirstDate(firstDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(firstDate, this._lastDate);
    }

    public updateLastDate(lastDate: Date | string): ScheduleConfiguration {
        return new ScheduleConfiguration(this._firstDate, lastDate);
    }

    static createDefaultConfiguration(): ScheduleConfiguration {
        const firstDate = DateUtil.getCurrentMonthFirstDate();
        const lastDate = DateUtil.getCurrentMonthLastDate();
        return new ScheduleConfiguration(firstDate, lastDate);
    }

}