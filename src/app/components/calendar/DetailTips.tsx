// Calendarのセルをクリックしたときに表示される詳細タスク情報を表示するコンポーネント
//  * @param props - プロパティ
//  * @param props.task - タスク情報を表す `CalendarCellTask` オブジェクト。
//  * @param props.onClose - 閉じるボタンがクリックされたときに呼び出されるコールバック関数。
//  * @returns 詳細タスク情報を表示するコンポーネント
//  */
import React from "react";

/**
 * Calendarのセルをクリックしたときに表示される詳細タスク情報を表示するコンポーネント
 * @param props - プロパティ
 * @param props.task - タスク情報を表す `CalendarCellTask` オブジェクト。
 * @param props.onClose - 閉じるボタンがクリックされたときに呼び出されるコールバック関数。
 * @returns 詳細タスク情報を表示するコンポーネント
 */
export default function DetailTips(props: { onClose: () => void, children: React.ReactNode }) {
    const children = props.children;
    return (
        <div className="detail-tips">
            <button onClick={props.onClose}>閉じる</button>
            {children}
        </div>
    );
}