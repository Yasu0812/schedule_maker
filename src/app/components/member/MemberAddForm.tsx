import { MemberManager } from "@/app/models/MemberManager";
import { JellyBean } from "../decorator/JellyBean";
import { MemberService } from "@/app/service/MemberService";


export default function MemberAddForm(props: {
    memberManager: MemberManager,
    handleMemberManagerChange: (memberManager: MemberManager) => void,
}) {

    const handleAddMember = () => {

        const memberManager = new MemberService().addMemberRandom(
            props.memberManager
        );

        props.handleMemberManagerChange(memberManager);
    };

    return (
        <JellyBean width={25} height={25} phase={""} selected={false}>
            <button onClick={handleAddMember} type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                +
            </button>
        </JellyBean>
    );
}