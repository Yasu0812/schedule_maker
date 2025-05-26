export class MemberTask {
    memberName: string;
    taskMap: Map<string, string>;

    /**
     * 
     * @param memberName メンバーの名前を表す文字列
     * @param taskMap keyがYYYY-MM-DD、値がタスク名のマップ
     */
    constructor(memberName: string, taskMap: Map<string, string>) {
        this.memberName = memberName;
        this.taskMap = taskMap;
    }

    /**
     * 
     * @param date 日付を表す文字列 ("YYYY-MM-DD")
     * @returns 
     */
    getTaskForDate(date: string): string | undefined {
        return this.taskMap.get(date);
    }

}