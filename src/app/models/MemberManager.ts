import { generateUUID, UUID } from "../common/IdUtil";
import Member from "./Member";

export class MemberManager {

    constructor(
        private _memberMap: Map<UUID, Member>
    ) { }

    public static factory(
        members: string[]
    ): MemberManager {
        const memberMap = new Map<UUID, Member>();
        members.forEach(member => {
            const id = generateUUID();
            memberMap.set(id, Member.factory(id, member));
        });
        return new MemberManager(memberMap);
    }

    public get memberMap(): Map<UUID, Member> {
        return this._memberMap;
    }

    public get ids(): UUID[] {
        return Array.from(this._memberMap.keys());
    }

    public get members(): Member[] {
        return Array.from(this._memberMap.values());
    }

    public getMember(id: UUID): Member | undefined {
        return this._memberMap.get(id);
    }

    public addMember(name: string): MemberManager {
        const id = generateUUID();
        this._memberMap.set(id, Member.factory(id, name));
        return this;
    }

    public removeMember(id: UUID): MemberManager {
        this._memberMap.delete(id);
        return this;
    }

    public updateMemberName(id: UUID, memberName: string): MemberManager {
        const member = this._memberMap.get(id);
        if (member) {
            const updatedMember = Member.factory(
                member.id,
                memberName,
                member.disableDates,
                member.isAvailable
            );
            this._memberMap.set(id, updatedMember);
        }
        return this;
    }
}