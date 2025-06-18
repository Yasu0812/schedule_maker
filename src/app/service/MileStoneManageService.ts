import { UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { MileStone } from "../models/MileStone";
import { MileStoneManager } from "../models/MileStoneManager";


export class MileStoneManageService {

    // Example method to create a milestone
    public createMileStone(mileStoneManager: MileStoneManager): MileStoneManager {
        // Implementation for creating a new milestone
        return mileStoneManager.createMileStone("New Milestone");
    }

    // Example method to update a milestone
    public updateMileStone(
        id: UUID,
        mileStoneManager: MileStoneManager,
        name?: string,
        day?: Date,
        prePhases?: Set<PhaseEnum>,
        postPhases?: Set<PhaseEnum>,
    ): MileStoneManager {

        const mileStone = mileStoneManager.getMileStone(id);
        if (mileStone) {
            const newName = name || mileStone.name;
            const newDay = day || mileStone.day;
            const newPrePhases = prePhases || mileStone.prePhases;
            const newPostPhases = postPhases || mileStone.postPhases;

            const newMileStone = new MileStone(id, newName, newDay, newPrePhases, newPostPhases);
            mileStoneManager.update(id, newMileStone);
            return mileStoneManager;
        }

        throw new Error(`MileStone with id ${id} not found`);

    }

    // Example method to delete a milestone
    public deleteMileStone(id: UUID, mileStoneManager: MileStoneManager): void {

        if (mileStoneManager.getMileStone(id)) {
            mileStoneManager.removeMileStone(id);
        } else {
            throw new Error(`MileStone with id ${id} not found`);
        }
    }
}