import { UUID } from '../common/IdUtil';
import { PhaseEnum } from '../common/PhaseEnum';
import { MileStone } from './MileStone';

export class MileStoneManager {

    private _mileStones: Map<UUID, MileStone> = new Map();

    public addMileStone(mileStone: MileStone): void {
        this._mileStones.set(mileStone.id, mileStone);
    }

    public getMileStone(id: UUID): MileStone | undefined {
        return this._mileStones.get(id);
    }

    public getAllMileStones(): MileStone[] {
        return Array.from(this._mileStones.values());
    }

    public removeMileStone(id: UUID): void {
        this._mileStones.delete(id);
    }

    public isIncludedInMileStone(
        mileStoneId: UUID,
        phase: PhaseEnum,
        judgeDay: Date,
    ): boolean {
        const mileStone = this.getMileStone(mileStoneId);
        if (!mileStone) {
            return false;
        }

        // マイルストーンのフェーズに指定されたフェーズが含まれているか確認
        if (!mileStone.phases.includes(phase)) {
            return false;
        }

        // マイルストーンの開始日と終了日を確認
        return judgeDay >= mileStone.startDay && judgeDay <= mileStone.endDay;

    }

    /**
     * 指定されたフェーズと日付が、どのマイルストーンにも含まれているかを確認します。
     * @param phase 
     * @param judgeDay 
     * @returns 
     */
    public isIncludedInAnyMileStone(
        phase: PhaseEnum,
        judgeDay: Date,
    ): boolean {
        for (const mileStone of this.getAllMileStones()) {
            if (this.isIncludedInMileStone(mileStone.id, phase, judgeDay)) {
                return true;
            }
        }
        return false;
    }
}