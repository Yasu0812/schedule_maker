import { MemberManager } from "@/app/models/MemberManager";
import { JellyBean } from "../decorator/JellyBean";


export default function MemberAddForm(props: {
    memberManager: MemberManager,
    handleMemberManagerChange: (memberManager: MemberManager) => void,
}) {

    const handleAddMember = () => {

        const memberManager = props.memberManager.addMember("name");

        props.handleMemberManagerChange(memberManager);
    };

    return (
        <form action={handleAddMember} className="calendar-box-form ">
            <JellyBean width={25} height={25} phase={""} selected={false}>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    +
                </button>
            </JellyBean>
        </form>
    );
}