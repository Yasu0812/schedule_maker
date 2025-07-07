import { DateUtil } from "@/app/common/DateUtil";
import { UUID } from "@/app/common/IdUtil";
import { AssignedTask } from "../AssignedTask";

export type AssignedTaskSerializableType = {
    id: UUID,
    ticketId: UUID,
    taskId: UUID,
    memberId: UUID,
    startDayStr: string,
    endDayStr: string,
}

/**
 * 割り当て済みのタスクを表すクラス
 * 割り当てられたメンバーと、実際に割り当てられた日程を持つ
 * @param id このデータのID
 * @param ticketId 対応するチケットのID
 * @param taskId 対応するタスクのID
 * @param memberId 割り当てられたメンバーのID
 * @param startDay 割り当て開始日
 * @param duration 割り当て期間（日数）
 * @param endDay 割り当て終了日
 */
export class AssignedTaskSerializable {


    public static serialize(
        assignedTask: {
            id: UUID,
            ticketId: UUID,
            taskId: UUID,
            memberId: UUID,
            startDay: Date,
            endDay: Date,
        }

    ): AssignedTaskSerializableType {

        return {
            id: assignedTask.id,
            ticketId: assignedTask.ticketId,
            taskId: assignedTask.taskId,
            memberId: assignedTask.memberId,
            startDayStr: DateUtil.formatDate(assignedTask.startDay),
            endDayStr: DateUtil.formatDate(assignedTask.endDay),
        };
    }

    public static deserialize(
        data: AssignedTaskSerializableType
    ): AssignedTask {
        return new AssignedTask(
            data.id,
            data.ticketId,
            data.taskId,
            data.memberId,
            DateUtil.parseDate(data.startDayStr),
            DateUtil.parseDate(data.endDayStr),
        );
    };

}