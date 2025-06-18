import { UUID } from "@/app/common/IdUtil";
import { MileStone } from "../MileStone";
import { DateUtil } from "@/app/common/DateUtil";
import { parsePhase } from "@/app/common/PhaseEnum";

export type MileStoneSerializableType = {
    id: UUID;
    name: string;
    dayStr: string | undefined;
    prePhases: string[];
    postPhases: string[];
}

export class MileStoneSerializable {
    public static serialize(mileStone: MileStone): MileStoneSerializableType {
        const dayStr = mileStone.day ? DateUtil.formatDate(mileStone.day) : undefined;

        return {
            id: mileStone.id,
            name: mileStone.name,
            dayStr: dayStr,
            prePhases: Array.from(mileStone.prePhases),
            postPhases: Array.from(mileStone.postPhases),
        };
    }

    public static deserialize(data: MileStoneSerializableType): MileStone {
        const day = data.dayStr ? DateUtil.parseDate(data.dayStr) : undefined;
        return new MileStone(
            data.id,
            data.name,
            day,
            new Set(data.prePhases.map(phase => parsePhase(phase))),
            new Set(data.postPhases.map(phase => parsePhase(phase))),
        );
    }
}