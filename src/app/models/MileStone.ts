import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";

export class MileStone {
    public id: UUID;
    public name: string;
    public startDay: Date;
    public endDay: Date;
    public phases: PhaseEnum[] = [];

    constructor(id: UUID, name: string, startDay: Date, endDay: Date, phases:PhaseEnum[]) {
        this.id = id;
        this.name = name;
        this.startDay = startDay;
        this.endDay = endDay;
        this.phases = phases;

    }

}