import { DateUtil } from "../common/DateUtil";
import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";

export class MileStone {
    public id: UUID;
    public name: string;
    public startDay: Date;
    public endDay: Date;
    public phases: PhaseEnum[] = [];

    constructor(id: UUID, name: string, phases: PhaseEnum[], startDay?: Date, endDay?: Date) {
        this.id = id;
        this.name = name;
        this.startDay = DateUtil.ifUndefinedGetMinDate(startDay);
        this.endDay = DateUtil.ifUndefinedGetMaxDate(endDay);
        this.phases = phases;

    }

}