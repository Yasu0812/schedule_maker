
export class DateUtil {

    /**
     * YYYY-MM-DDT00:00:00Z形式の文字列から日付のリストを生成します。
     * @param startDateStr 
     * @param endDateStr 
     * @returns 
     */
    static generateDayList(startDateStr: string, endDateStr: string): Date[] {
        const startDate = DateUtil.parseDate(startDateStr);
        const endDate = DateUtil.parseDate(endDateStr);
        const dayList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dayList.push(new Date(currentDate));
            currentDate.setUTCDate(currentDate.getDate() + 1);
        }

        return dayList;
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
}