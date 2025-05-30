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

    public getMileStonesByPhase(phase: PhaseEnum): MileStone[] {
        return Array.from(this._mileStones.values()).filter(mileStone => mileStone.phases.includes(phase));
    }

    /**
     * 該当するフェーズのマイルストーンの期間を取得します。
     * 指定したフェーズにマイルストーンが存在しない場合は、undefinedを返します。
     * @param phase 
     * @returns 
     */
    public getPhasePeriod(phase: PhaseEnum): { startDay: Date, endDay: Date } | undefined {
        const phaseMileStones = this.getMileStonesByPhase(phase);
        if (phaseMileStones.length === 0) {
            return undefined;
        }
        const startDay = new Date(Math.min(...phaseMileStones.map(m => m.startDay.getTime())));
        const endDay = new Date(Math.max(...phaseMileStones.map(m => m.endDay.getTime())));

        return { startDay, endDay };
    }

    /**
     * 指定したフェーズの期間内に指定した日付が含まれるかどうかを判定します。
     * フェーズに対応するマイルストーンがない場合は、無条件でtrueを返します。
     * @param phase 
     * @param baseDate 
     * @returns 
     */
    public isInPhasePeriod(phase: PhaseEnum, baseDate: Date): boolean {
        const period = this.getPhasePeriod(phase);
        if (!period) {
            return true; // フェーズに対応するマイルストーンがない場合は無条件でtrue
        }
        return baseDate >= period.startDay && baseDate <= period.endDay;
    }
}