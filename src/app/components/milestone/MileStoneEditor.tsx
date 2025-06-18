import { UUID } from "@/app/common/IdUtil";
import { orderedPhases, parsePhase, PhaseEnum, phaseNameMap } from "@/app/common/PhaseEnum";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { MileStoneManageService } from "@/app/service/MileStoneManageService";

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
                    <div className="mb-2">
                        <label className="block mb-1">前のフェーズ:</label>
                        <select
                            multiple
                            value={Array.from(selectedMileStone.prePhases)}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => parsePhase(option.value));
                                mileStoneChange({ prePhases: new Set(selectedOptions) });
                            }}
                            className="border p-2 rounded w-full"
                        >
                            {orderedPhases.map((phase) => (
                                <option key={phase} value={phase}>{phaseNameMap[phase]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block mb-1">次のフェーズ:</label>
                        <select
                            multiple
                            value={Array.from(selectedMileStone.postPhases)}
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions).map(option => parsePhase(option.value));
                                mileStoneChange({ postPhases: new Set(selectedOptions) });
                            }}
                            className="border p-2 rounded w-full"
                        >
                            {orderedPhases.map((phase) => (
                                <option key={phase} value={phase}>{phaseNameMap[phase]}</option>
                            ))}
                        </select>
                    </div>
                </div>
            }
        </div>
    );
}