import { DateUtil } from '../common/DateUtil';
import { UUID } from '../common/IdUtil';
import { orderedPhases, PhaseEnum } from '../common/PhaseEnum';
import { MileStone } from './MileStone';

export class MileStoneManager {

    private _mileStones: Map<UUID, MileStone>;

    constructor(mileStones: Map<UUID, MileStone> = new Map<UUID, MileStone>()) {
        this._mileStones = mileStones;
    }

    public get mileStones(): Map<UUID, MileStone> {
        return this._mileStones;
    }

    public createMileStone(name: string): MileStoneManager {
        const mileStone = MileStone.create(name);
        this.addMileStone(mileStone);
        return this;
    }

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

    public getMileStoneByDay(day: Date): MileStone[] {
        return Array.from(this._mileStones.values()).filter(mileStone => {
            if (!mileStone.day) {
                return false; // Skip if the mileStone does not have a day set
            }
            return DateUtil.formatDateWithHyphenNoTimeZone(mileStone.day) === DateUtil.formatDateWithHyphenNoTimeZone(day);
        });
    }

    public update(
        id: UUID,
        newMileStone: MileStone
    ): void {
        const existingMileStone = this.getMileStone(id);
        if (existingMileStone) {
            this._mileStones.set(id, newMileStone);
        } else {
            throw new Error(`MileStone with id ${id} not found`);
        }
    }

    public isEnabledPhase(phase: PhaseEnum, toDate: Date): boolean {

        for (const mileStone of this._mileStones.values()) {
            if (mileStone.isDisabledPhase(phase, toDate)) {
                return false;
            }
        }
        return true;
    }

    public isDisabledPhase(phase: PhaseEnum, toDate: Date): boolean {
        return !this.isEnabledPhase(phase, toDate);
    }

    public getEnabledPhases(toDate: Date): Set<PhaseEnum> {
        const enabledPhases = orderedPhases.filter(phase => this.isEnabledPhase(phase, toDate));
        return new Set(enabledPhases);

    }

    public getDisabledPhases(toDate: Date): Set<PhaseEnum> {
        const disabledPhases = orderedPhases.filter(phase => this.isDisabledPhase(phase, toDate));
        return new Set(disabledPhases);
    }
}