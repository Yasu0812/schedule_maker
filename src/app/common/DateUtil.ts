export class DateUtil {

    /**
     * YYYY-MM-DDT00:00:00Z形式の文字列から日付のリストを生成します。
     * @param startDateStr 
     * @param endDateStr 
     * @returns 
     */
    static generateDayList(startDateStr: string | Date, endDateStr: string | Date): Date[] {
        const startDate = typeof startDateStr === "string" ? DateUtil.parseDate(startDateStr) : new Date(startDateStr);
        const endDate = typeof endDateStr === "string" ? DateUtil.parseDate(endDateStr) : new Date(endDateStr);
        const dayList: Date[] = [];
        const [startDateSorted, endDateSorted] = startDate < endDate ? [startDate, endDate] : [endDate, startDate];

        const currentDate = new Date(startDateSorted);

        while (currentDate <= endDateSorted) {
            dayList.push(new Date(currentDate));
            currentDate.setUTCDate(currentDate.getDate() + 1);
        }

        return dayList;
    }

    /**
     * 現在の日付をYYYY-MM-DDT00:00:00Z形式の文字列で返します。
     * @returns
     * 
     */
    static getCurrentDateStr(): string {
        const now = new Date();
        return DateUtil.formatDate(now);
    }

    /**
     * 現在の日付を元に、指定された日数を加算した日付をYYYY-MM-DDT00:00:00Z形式の文字列で返します。
     * @param addDay 加算する日数
     */
    static getCurrentDateStrWithAddDay(addDay: number): string {
        const now = this.getAddDate(new Date(), addDay);
        return DateUtil.formatDate(now);
    }

    /**
     * 現在の月の初日をYYYY-MM-DDT00:00:00Z形式の文字列で返します。
     * @return 
     */
    static getCurrentMonthFirstDateStr(): string {
        const now = new Date();
        const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        return DateUtil.formatDate(firstDay);
    }

    /**
     * 現在の月の初日をdateで返します。
     */
    static getCurrentMonthFirstDate(): Date {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    }

    /**
     * 現在の月の最終日をYYYY-MM-DDT00:00:00Z形式の文字列で返します。
     * @return 
     */
    static getCurrentMonthLastDateStr(): string {
        const now = new Date();
        const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
        return DateUtil.formatDate(lastDay);
    }

    /**
     * 現在の月の最終日をdateで返します。
     */
    static getCurrentMonthLastDate(): Date {
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
    }

    /**
     * 日付をYYYY-MM-DDT00:00:00Z形式の文字列に変換します。
     * @param date 日付オブジェクト
     * @returns 
     */
    static formatDate(date: Date): string {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}T00:00:00Z`;
    }

    /**
     * 日付をYYYY-MM-DD形式の文字列に変換します。
     * @param date 日付オブジェクト
     * @returns 
     */
    static formatDateWithHyphenNoTimeZone(date: Date): string {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /**
     * YYYY-MM-DDT00:00:00Z形式の文字列を日付オブジェクトに変換します。
     * @param dateStr 
     * @returns 
     */
    static parseDate(dateStr: string): Date {
        const regex = /^\d{4}-\d{2}-\d{2}T00:00:00Z$/;
        if (!regex.test(dateStr)) {
            throw new Error("Invalid date format. Expected format is YYYY-MM-DDT00:00:00Z");
        }
        return new Date(dateStr);
    }

    /**
     * YYYY-MM-DD形式の文字列を日付オブジェクトに変換します。
     * @param dateStr 
     * @returns 
     */
    static parseDateWithHyphen(dateStr: string): Date {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) {
            throw new Error("Invalid date format. Expected format is YYYY-MM-DDT00:00:00Z");
        }
        return new Date(dateStr + "T00:00:00Z");
    }

    /**
     * 日付をmm/dd形式の文字列に変換します。
     * @param date 日付オブジェクト
     * @returns 
     */
    static formatDateShow(date: Date): string {
        const month = String(date.getUTCMonth() + 1);
        const day = String(date.getUTCDate());
        return `${month}/${day}`;
    }

    static getFromDayNum(date: Date, dayNum: number): Date {
        const newDate = new Date(date);
        newDate.setUTCDate(newDate.getUTCDate() + dayNum);
        return newDate;
    }

    static getAddDate(date: Date, addDay: number): Date {
        const newDate = new Date(date);
        newDate.setUTCDate(newDate.getUTCDate() + addDay);
        return newDate;
    }

    static getEndDateNoHoliday(date: Date, addDay: number): Date {
        const newDate = new Date(date);
        let addedDays = 0;
        while (addedDays < addDay) {
            newDate.setUTCDate(newDate.getUTCDate() + 1);
            if (!this.isHoliday(newDate)) {
                addedDays++;
            }
        }
        return newDate;
    }

    static getDayOfWeekString(date: Date): string {
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        return daysOfWeek[date.getUTCDay()];
    }

    static getDayOfWeekStringFromString(dateStr: string): string {
        const date = new Date(dateStr);
        return this.getDayOfWeekString(date);
    }

    static isHoliday(date: Date): boolean {
        const day = date.getUTCDay();
        return day === 0 || day === 6;
    }

    static getFastestDay(dates: Date[]): Date {
        if (dates.length === 0) {
            throw new Error("Date list is empty");
        }
        return dates.reduce((earliest, current) => current < earliest ? current : earliest);
    }

    static getLatestDay(dates: Date[]): Date {
        if (dates.length === 0) {
            throw new Error("Date list is empty");
        }
        return dates.reduce((latest, current) => current > latest ? current : latest);
    }

    /**
     * もし日付がundefined、または与えられていないなら、最小値の日付を返します。
     * @param date 
     * @returns 
     */
    static ifUndefinedGetMinDate(date?: Date | undefined): Date {
        if (date === undefined) {
            return new Date(-8640000000000000); // 最小値を返す
        }
        return date;
    }

    /**
     *もし日付がundefined、または与えられていないなら、最大値の日付を返します。
     * @param date 
     * @returns 
     */
    static ifUndefinedGetMaxDate(date?: Date | undefined): Date {
        if (date === undefined) {
            return new Date(8640000000000000); // 最大値を返す
        }
        return date;
    }

    static isSameDay(date1: Date | string, date2: Date | string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}T00:00:00Z$/;

        if (typeof date1 === "string" && !regex.test(date1)) {
            throw new Error("Invalid date format for date1. Expected format is YYYY-MM-DDT00:00:00Z");
        }
        if (typeof date2 === "string" && !regex.test(date2)) {
            throw new Error("Invalid date format for date2. Expected format is YYYY-MM-DDT00:00:00Z");
        }

        const d1 = typeof date1 === "string" ? DateUtil.parseDate(date1) : new Date(date1);
        const d2 = typeof date2 === "string" ? DateUtil.parseDate(date2) : new Date(date2);
        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
               d1.getUTCMonth() === d2.getUTCMonth() &&
               d1.getUTCDate() === d2.getUTCDate();
    }
}