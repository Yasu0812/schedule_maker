import { UUID } from "../common/IdUtil";

export default class Member {
    readonly id: UUID;
    readonly name: string;
    readonly disableDates: Date[];
    readonly isAvailable: boolean;

    constructor(member: {
        id: UUID;
        name: string;
        disableDates: Date[];
        isAvailable: boolean;
    }) {
        this.id = member.id;
        this.name = member.name;
        this.disableDates = member.disableDates;
        this.isAvailable = member.isAvailable;
    }

    public static factory(
        id: UUID,
        name: string,
        disableDates: Date[] = [],
        isAvailable: boolean = true
    ): Member {
        return new Member({ id, name, disableDates, isAvailable });
    }
}
