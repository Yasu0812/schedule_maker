import { generateUUID, UUID } from "../common/IdUtil";
import { Phase } from "../common/PhaseEnum";

/**
 * Calendarのセルに表示するタスクを表すクラス。
 * この一つのクラスを、一つのセルに表示する。
 */
export class CalendarCellTask {

    constructor(
        public readonly taskName: string,
        public readonly taskId: UUID,
        public readonly taskDate: string,
        public readonly taskPhase: string,
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
     * @param memberName メンバーの名前を表す文字列。
     * @param taskMap タスクのマップ。キーはYYYY-MM-DD、値は `CalendarCellTask` オブジェクト。
     */
    constructor(
        public readonly memberName: string,
        public taskMap: Map<string, CalendarCellTask>,
    ) { }

    /**
     * 指定された日付に対応するタスクを取得します。
     *
     * @param date - タスクを取得したい日付を表す文字列 (例: "YYYY-MM-DD")。
     * @returns 指定された日付に対応する `CalendarCellTask` オブジェクト。  
     *          該当するタスクが存在しない場合は `undefined` を返します。
     */
    getTaskForDate(date: string): CalendarCellTask | undefined {
        return this.taskMap.get(date);
    }
}

/**
 * Calendarのセルに表示するすべてのタスクをまとめたクラス
 * このクラスは、メンバーごとにタスクを管理するためのもの。
 * @param memberList メンバーのリスト
 * @param taskMap メンバーごとのタスクのマップ。キーはメンバー名、値は日付をキーとする `CalendarCellTask` のマップ。
 */
export class CalendarCellTaskManager {

    private _memberTaskMap: Map<string, CalendarLineTask> = new Map<string, CalendarLineTask>();
    private _memberList: readonly string[];

    constructor(
        memberList: string[],
        taskMap: Map<string, Map<string, CalendarCellTask>>,
    ) {
        this._memberList = memberList;
        this._memberTaskMap = new Map<string, CalendarLineTask>();

        // メンバーリストを元に、メンバーごとのタスクマップを初期化する
        for (const member of memberList) {
            const taskMapForMember = taskMap.get(member) || new Map<string, CalendarCellTask>();
            this._memberTaskMap.set(member, new CalendarLineTask(member, taskMapForMember));
        }
    }

    get memberList(): readonly string[] {
        return this._memberList;
    }

    static createMockData(): CalendarCellTaskManager {
        const memberList = ["Alice", "Bob", "Charlie", "David", "Eve"];
        const taskMap = new Map<string, Map<string, CalendarCellTask>>();
        let j = 0;

        // メンバーごとのタスクを初期化
        for (const member of memberList) {
            const taskMapForMember = new Map<string, CalendarCellTask>();
            for (let i = 1; i <= 20; i++) {
                const date = `2025-04-${i < 10 ? '0' + i : i}`;

                const phase = i % 2 === 0 ? Phase.DEVELOPMENT : Phase.UNIT_TEST;
                const task = new CalendarCellTask(`Task ${i}-${j}`, generateUUID(), date, phase, `Task ${i} description`);
                taskMapForMember.set(date, task);

            }
            j++;
            taskMap.set(member, taskMapForMember);
        }

        return new CalendarCellTaskManager(memberList, taskMap);
    }

    getCalendarLine(member: string): CalendarLineTask {
        return this._memberTaskMap.get(member) || new CalendarLineTask(member, new Map<string, CalendarCellTask>());
    }

    getAllCalendarLineMap(): Map<string, CalendarLineTask> {
        return this._memberTaskMap;
    }

}