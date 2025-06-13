import { UUID } from "../common/IdUtil";
import { MemberNameSample } from "../common/MemberNameSample";
import { MemberManager } from "../models/MemberManager";
import { PlanedTask } from "../models/PlanedTask";

export class MemberService {

    public addMember(
        memberName: string,
        memberManager: MemberManager,
    ): MemberManager {
        return memberManager.addMember(memberName);
    }

    public addMemberRandom(
        memberManager: MemberManager,
    ): MemberManager {
        const randomMemberName = MemberNameSample.getRandomMemberName();
        return this.addMember(randomMemberName, memberManager);
    }

    public removeMember(
        memberId: UUID,
        memberManager: MemberManager,
        planedTask: PlanedTask
    ): {
        memberManager: MemberManager;
        planedTask: PlanedTask;
    } {
        return {
            memberManager: memberManager.removeMember(memberId),
            planedTask: planedTask.removeFromMemberId(memberId)
        };

    }

    public updateMemberName(
        memberId: UUID,
        memberName: string,
        memberManager: MemberManager,
    ): MemberManager {

        return memberManager.updateMember(memberId, memberName);

    }
}