import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";

/**
 * Calendarのセルに表示するタスクを表すクラス。
 * この一つのクラスを、一つのセルに表示する。
 */
export class CalendarCellTask {

    constructor(
        public readonly taskName: string,
        public readonly taskId: UUID,
        public readonly taskDate: string,
        public readonly taskPhase: PhaseEnum,
        public readonly taskDescription: string,
    ) { }

}

/**
 * Calendarのセルに表示するタスクを、メンバーごとにまとめたクラス。  
 * カレンダー上では行で表現されるため、CalendarLineクラスに相当します。
 */
export class CalendarLineTask {

    /**
     * コンストラクタ。
     * 
     * @param memberId メンバーのIDを表す文字列。
     * @param taskMap タスクのマップ。キーはYYYY-MM-DDT00:00:00Z、値は `CalendarCellTask` オブジェクト。
     */
    constructor(
        public readonly memberId: string,
        public taskMap: Map<string, CalendarCellTask>,
    ) { }

    /**
     * 指定された日付に対応するタスクを取得します。
     *
     * @param date - タスクを取得したい日付を表す文字列 (例: "YYYY-MM-DDT00:00:00Z")。
     * @returns 指定された日付に対応する `CalendarCellTask` オブジェクト。  
     *          該当するタスクが存在しない場合は `undefined` を返します。
     */
    getTaskForDate(date: string): CalendarCellTask | undefined {
        return this.taskMap.get(date);
    }

    public hasTask(): boolean {
        return this.taskMap.size !== 0;
    }
}

/**
 * Calendarのセルに表示するすべてのタスクをまとめたクラス
 * このクラスは、メンバーごとにタスクを管理するためのもの。
 * @param memberList メンバーのリスト
 * @param taskMap メンバーごとのタスクのマップ。キーはメンバー名、値は日付をキーとする `CalendarCellTask` のマップ。
 */
export class CalendarCellTaskManager {

    private _memberTaskMap: Map<UUID, CalendarLineTask> = new Map<UUID, CalendarLineTask>();
    public readonly firstDate: Date;
    public readonly lastDate: Date;
    public readonly dayList: Date[];

    constructor(
        memberIds: UUID[],
        taskMap: Map<string, Map<string, CalendarCellTask>>,
        firstDate: Date,
        lastDate: Date,
    ) {
        this._memberTaskMap = new Map<UUID, CalendarLineTask>();
        this.firstDate = firstDate;
        this.lastDate = lastDate;
        this.dayList = DateUtil.generateDayList(DateUtil.formatDate(firstDate), DateUtil.formatDate(lastDate));

        // メンバーリストを元に、メンバーごとのタスクマップを初期化する
        for (const memberId of memberIds) {
            const taskMapForMember = taskMap.get(memberId) || new Map<string, CalendarCellTask>();
            this._memberTaskMap.set(memberId, new CalendarLineTask(memberId, taskMapForMember));
        }
    }

    getCalendarLine(memberId: UUID): CalendarLineTask {
        return this._memberTaskMap.get(memberId) || new CalendarLineTask(memberId, new Map<string, CalendarCellTask>());
    }

    getAllCalendarLineMap(): Map<string, CalendarLineTask> {
        return this._memberTaskMap;
    }

    getAllCell(): CalendarCellTask[] {
        const allTasks: CalendarCellTask[] = [];
        this._memberTaskMap.forEach((calendarLineTask) => {
            calendarLineTask.taskMap.forEach((task) => {
                allTasks.push(task);
            });
        });
        return allTasks;
    }

}