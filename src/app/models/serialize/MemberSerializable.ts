import { DateUtil } from "@/app/common/DateUtil";
import { UUID } from "@/app/common/IdUtil";
import Member from "../Member";

export type MemberSerializableType = {
    readonly id: UUID;
    readonly name: string;
    readonly disableDatesStr: string[];
    readonly isAvailable: boolean;
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
export class MemberSerializable {


    public static serialize(
        member: {
            id: UUID;
            name: string;
            disableDates: Date[];
            isAvailable: boolean;
        }
    ): MemberSerializableType {

        return {
            id: member.id,
            name: member.name,
            disableDatesStr: member.disableDates.map(date => DateUtil.formatDate(date)),
            isAvailable: member.isAvailable
        };
    }

    public static deserialize(
        data: MemberSerializableType
    ): Member {
        return Member.factory(
            data.id,
            data.name,
            data.disableDatesStr.map(dateStr => DateUtil.parseDate(dateStr)),
            data.isAvailable
        );
    };

}