import { MileStoneManager } from "@/app/models/MileStoneManager";
import MileStoneList from "./MileStoneList";
import MileStoneEditor from "./MileStoneEditor";
import { useState } from "react";
import { UUID } from "@/app/common/IdUtil";

export default function MileStoneConfig(
    props: {
        mileStoneManager: MileStoneManager
        setMileStoneManager: (mileStoneManager: MileStoneManager) => void;
    }
) {

    const { mileStoneManager, setMileStoneManager } = props;

    const [selectedMileStoneId, setSelectedMileStoneId] = useState<UUID | undefined>();

    return (
        <div>
            <MileStoneList
                mileStoneManager={mileStoneManager}
                setMileStoneManager={setMileStoneManager}
                selectedMileStoneId={selectedMileStoneId}
                onSelect={(id) => setSelectedMileStoneId(id)}
            />
            {selectedMileStoneId &&
                <MileStoneEditor
                    mileStoneManager={mileStoneManager}
                    selectedMileStoneId={selectedMileStoneId}
                    setMileStoneManager={setMileStoneManager}
                />
            }

        </div>
    );
}