import { UUID } from "@/app/common/IdUtil";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import PlusButton from "../atom/PlusButton";
import { MileStoneManageService } from "@/app/service/MileStoneManageService";

export default function MileStoneList(
    props: {
        mileStoneManager: MileStoneManager
        setMileStoneManager: (mileStoneManager: MileStoneManager) => void;
        selectedMileStoneId: UUID | undefined
        onSelect?: (mileStoneId: UUID) => void
    }
) {

    const { mileStoneManager, setMileStoneManager } = props;

    const onClickAddMileStone = () => {
        const newMileStone = new MileStoneManageService().createMileStone(mileStoneManager);
        setMileStoneManager(newMileStone);

    }

    return (
        <div>
            {
                mileStoneManager.getAllMileStones().map((mileStone) => (
                    <div
                        key={mileStone.id}
                        className={`p-4 mb-2 rounded-lg cursor-pointer ${props.selectedMileStoneId === mileStone.id ? 'bg-blue-100' : 'bg-gray-100'}`}
                        onClick={() => props.onSelect?.(mileStone.id)}
                    >
                        {mileStone.name}
                    </div>
                ))
            }
            <PlusButton
                onClick={onClickAddMileStone}
            />
        </div>
    );
}