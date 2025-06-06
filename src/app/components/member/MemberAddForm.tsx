import { MemberManager } from "@/app/models/MemberManager";


export default function MemberAddForm(props: {
    memberManager: MemberManager,
    handleMemberManagerChange: (memberManager: MemberManager) => void,
}) {

    const handleAddMember = (formData: FormData) => {

        const memberManager = props.memberManager.addMember("name");

        props.handleMemberManagerChange(memberManager);
    };

    return (
        <form action={handleAddMember} className="calendar-box-form">
            <button type="submit" className="btn btn-primary">[+]</button>

        </form>
    );
}