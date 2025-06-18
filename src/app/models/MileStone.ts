import { generateUUID, UUID } from "../common/IdUtil";
import { orderedPhases, PhaseEnum } from "../common/PhaseEnum";

export interface MileStoneType {
    id: UUID;
    name: string;
    day: Date;
    prePhases: Set<PhaseEnum>;
    postPhases: Set<PhaseEnum>;
}

/**
 * プロジェクトのマイルストーンを表すクラスです。
 * @param id - マイルストーンの一意な識別子
 * @param name - マイルストーンの名前
 * @param day - マイルストーンの日付(この日までprePhaseは可能で、この日より後にpostPhaseが可能)
 * @param prePhases - マイルストーンの前に完了している必要があるフェーズのリスト
 * @param postPhases - マイルストーンの後に開始されるフェーズのリスト
 */
export class MileStone {
    public id: UUID;
    public name: string;
    public day: Date | undefined;
    public prePhases: Set<PhaseEnum>;
    public postPhases: Set<PhaseEnum>;
    public _unrelatedPhases: Set<PhaseEnum>;

    constructor(id: UUID, name: string, day?: Date, prePhases?: Iterable<PhaseEnum>, postPhases?: Iterable<PhaseEnum>) {
        this.id = id;
        this.name = name;
        this.day = day;
        this.prePhases = new Set(prePhases || orderedPhases);
        this.postPhases = new Set(postPhases || orderedPhases);

        this._unrelatedPhases = new Set(orderedPhases.filter(phase => !this.prePhases.has(phase) && !this.postPhases.has(phase)));
    }

    public static create(name: string, day?: Date, prePhases?: Iterable<PhaseEnum>, postPhases?: Iterable<PhaseEnum>): MileStone {
        return new MileStone(generateUUID(), name, day, prePhases, postPhases);
    }

    public isEnabledPhase(phase: PhaseEnum, toDate: Date): boolean {

        if (this._unrelatedPhases.has(phase)) {
            // マイルストーンに関連するフェーズでない場合は、true
            return true;
        }

        if (!this.day) {
            // マイルストーンの日付が設定されていない場合は、常にtrue
            return true;
        }

        const isAfter = toDate > this.day;

        // マイルストーンの日付が過ぎている場合は、postPhasesに含まれていればtrue
        if (isAfter) {
            return this.postPhases.has(phase);
        }
        // マイルストーンの日付以前の場合は、prePhasesに含まれていればtrue
        return this.prePhases.has(phase);
    }

    public isDisabledPhase(phase: PhaseEnum, toDate: Date): boolean {
        return !this.isEnabledPhase(phase, toDate);
    }

    public getEnabledPhases(toDate: Date): Set<PhaseEnum> {

        if (!this.day) {
            // マイルストーンの日付が設定されていない場合は、すべてのフェーズが有効
            return new Set(orderedPhases);
        }

        if (toDate > this.day) {
            // マイルストーンの日付が過ぎている場合は、postPhasesを返却
            return new Set([...this.postPhases, ...this._unrelatedPhases]);
        } else {
            // マイルストーンの日付以前の場合は、prePhasesを返却
            return new Set([...this.prePhases, ...this._unrelatedPhases]);
        }

    }

    public getDisabledPhases(toDate: Date): Set<PhaseEnum> {
        const enabledPhases = this.getEnabledPhases(toDate);
        return new Set(orderedPhases.filter(phase => !enabledPhases.has(phase)));
    }


}