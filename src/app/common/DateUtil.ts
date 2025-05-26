
export class DateUtil {

    static generateDayList(startDateStr: string, endDateStr: string): Date[] {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        const dayList: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dayList.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dayList;
    }

    /**
     * 日付をYYYY-MM-DD形式の文字列に変換します。
     * @param date 日付オブジェクト
     * @returns 
     */
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    /**
     * 日付をmm/dd形式の文字列に変換します。
     * @param date 日付オブジェクト
     * @returns 
     */
    static formatDateShow(date: Date): string {
        const month = String(date.getMonth() + 1);
        const day = String(date.getDate());
        return `${month}/${day}`;
    }

    static getAddDate(date: Date, addDay: number): Date {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + addDay);
        return newDate;
    }
}