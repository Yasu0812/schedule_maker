import { generateUUID, UUID } from "../common/IdUtil";

export class MemberManager {

    constructor(
        private _memberMap: Map<UUID, string>
    ) { }

    public static factory(
        members: string[]
    ): MemberManager {
        const memberMap = new Map<UUID, string>();
        members.forEach(member => {
            const id = generateUUID();
            memberMap.set(id, member);
        });
        return new MemberManager(memberMap);
    }

    public get memberMap(): Map<UUID, string> {
        return this._memberMap;
    }

    public get ids(): UUID[] {
        return Array.from(this._memberMap.keys());
    }

    public get members(): string[] {
        return Array.from(this._memberMap.values());
    }

    public getMember(id: UUID): string | undefined {
        return this._memberMap.get(id);
    }

    public addMember(member: string): MemberManager {
        const id = generateUUID();
        this._memberMap.set(id, member);
        return this;
    }

    public removeMember(id: UUID): MemberManager {
        this._memberMap.delete(id);
        return this;
    }

    public updateMember(id: UUID, member: string): MemberManager {
        if (this._memberMap.has(id)) {
            this._memberMap.set(id, member);
        } else {
            throw new Error(`Member with id ${id} does not exist.`);
        }
        return this;
    }
}