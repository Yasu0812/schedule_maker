import { UUID } from "@/app/common/IdUtil";
import { PhaseEnum } from "@/app/common/PhaseEnum";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { MileStoneManageService } from "@/app/service/MileStoneManageService";
import PhaseSelector from "./PhaseSelector";

export default function MileStoneEditor(
    props: {
        mileStoneManager: MileStoneManager
        selectedMileStoneId: UUID,
        setMileStoneManager: (mileStoneManager: MileStoneManager) => void;
    }
) {

    const { mileStoneManager, setMileStoneManager } = props;

    const selectedMileStone = mileStoneManager.getMileStone(props.selectedMileStoneId);

    if (!selectedMileStone) {
        return <p className="text-red-500">選択されたマイルストーンが見つかりません。</p>;
    }

    const mileStoneChange = (prop: {
        name?: string,
        day?: Date,
        prePhases?: Set<PhaseEnum>,
        postPhases?: Set<PhaseEnum>
    }) => {
        const newManager = new MileStoneManageService().updateMileStone(
            selectedMileStone.id,
            mileStoneManager,
            prop.name,
            prop.day,
            prop.prePhases,
            prop.postPhases
        );

        setMileStoneManager(newManager);
    }

    const prePhaseChange = (targetPhase: PhaseEnum) => {
        const newPrePhases = new Set(selectedMileStone.prePhases);
        if (newPrePhases.has(targetPhase)) {
            newPrePhases.delete(targetPhase);
        } else {
            newPrePhases.add(targetPhase);
        }
        mileStoneChange({ prePhases: newPrePhases });
    }

    const postPhaseChange = (targetPhase: PhaseEnum) => {
        const newPostPhases = new Set(selectedMileStone.postPhases);
        if (newPostPhases.has(targetPhase)) {
            newPostPhases.delete(targetPhase);
        } else {
            newPostPhases.add(targetPhase);
        }
        mileStoneChange({ postPhases: newPostPhases });
    }

    return (
        <div>
            {
                selectedMileStone &&
                <div className="p-4 mb-2 rounded-lg bg-gray-100">
                    <h2 className="text-xl font-bold mb-2">{selectedMileStone.name}</h2>
                    <input
                        type="text"
                        value={selectedMileStone.name}
                        onChange={(e) => {
                            mileStoneChange(
                                { name: e.target.value },
                            );
                        }}
                        className="border p-2 rounded w-full mb-2"
                    />
                    <input
                        type="date"
                        value={selectedMileStone.day ? selectedMileStone.day.toISOString().split('T')[0] : ''}
                        onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined;
                            mileStoneChange(
                                { day: date },
                            );
                        }}
                        className="border p-2 rounded w-full mb-2"
                    />
                    <h2 className="text-xl font-bold mb-2">Enable Phases</h2>
                    <div className="flex gap-8">

                        <div className="mb-2">
                            <h3 className="text-xl mb-2">Before</h3>
                            <PhaseSelector phases={selectedMileStone.prePhases} phaseChange={prePhaseChange} />
                        </div>
                        <div className="mb-2">
                            <h3 className="text-xl mb-2">After</h3>
                            <PhaseSelector phases={selectedMileStone.postPhases} phaseChange={postPhaseChange} />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}