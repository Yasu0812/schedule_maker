export const Phase = {
    REQUIREMENTS_DEFINITION: 'requirements-definition', // 要件定義
    DESIGN: 'design', // 設計
    DEVELOPMENT: 'development', // 製造
    UNIT_TEST_DOCUMENT_CREATION: 'unit-test-document-creation', // 単体テスト仕様書作成
    UNIT_TEST: 'unit-test', // 単体テスト
    INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION: 'integration-test-internal-document-creation', // 内部結合テスト仕様書作成
    INTEGRATION_TEST_INTERNAL: 'integration-test-internal', // 内部結合テスト
    INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION: 'integration-test-external-document-creation', // 外部結合テスト仕様書作成
    INTEGRATION_TEST_EXTERNAL: 'integration-test-external', // 外部結合テスト
} as const;

export type PhaseEnum = typeof Phase[keyof typeof Phase];

export const parsePhase = (phase: string): PhaseEnum => {
    if (Object.values(Phase).includes(phase as PhaseEnum)) {
        return phase as PhaseEnum;
    }

    throw new Error(`Invalid phase: ${phase}`);
}

export const orderedPhases: PhaseEnum[] = [
    Phase.REQUIREMENTS_DEFINITION,
    Phase.DESIGN,
    Phase.DEVELOPMENT,
    Phase.UNIT_TEST_DOCUMENT_CREATION,
    Phase.UNIT_TEST,
    Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION,
    Phase.INTEGRATION_TEST_INTERNAL,
    Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION,
    Phase.INTEGRATION_TEST_EXTERNAL,
];

export const afterPhase = (currentPhase: PhaseEnum): PhaseEnum | undefined => {
    const currentIndex = orderedPhases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === orderedPhases.length - 1) {
        return undefined; // No next phase
    }
    return orderedPhases[currentIndex + 1];
}

export const afterPhases = (currentPhase: PhaseEnum): PhaseEnum[] => {
    const currentIndex = orderedPhases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === orderedPhases.length - 1) {
        return []; // No next phases
    }
    return orderedPhases.slice(currentIndex + 1);
}

export const previousPhase = (currentPhase: PhaseEnum): PhaseEnum | undefined => {
    const currentIndex = orderedPhases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === 0) {
        return undefined; // No previous phase
    }
    return orderedPhases[currentIndex - 1];
}

export const previousPhases = (currentPhase: PhaseEnum): PhaseEnum[] => {
    const currentIndex = orderedPhases.indexOf(currentPhase);
    if (currentIndex === -1 || currentIndex === 0) {
        return []; // No previous phases
    }
    return orderedPhases.slice(0, currentIndex);
}

export const phaseCompare = (phase1: PhaseEnum, phase2: PhaseEnum): number => {
    const index1 = orderedPhases.indexOf(phase1);
    const index2 = orderedPhases.indexOf(phase2);

    if (index1 === -1 || index2 === -1) {
        throw new Error(`Invalid phase comparison: ${phase1}, ${phase2}`);
    }

    return index1 - index2;
}

export const isAfterPhase = (phase1: PhaseEnum, phase2: PhaseEnum): boolean => {
    return phaseCompare(phase1, phase2) > 0;
}

export const isBeforePhase = (phase1: PhaseEnum, phase2: PhaseEnum): boolean => {
    return phaseCompare(phase1, phase2) < 0;
}

export const isSamePhase = (phase1: PhaseEnum, phase2: PhaseEnum): boolean => {
    return phaseCompare(phase1, phase2) === 0;
}


export const phaseNameMap: Record<PhaseEnum, string> = {
    [Phase.REQUIREMENTS_DEFINITION]: '要件定義',
    [Phase.DESIGN]: '設計',
    [Phase.DEVELOPMENT]: '製造',
    [Phase.UNIT_TEST_DOCUMENT_CREATION]: '単体テスト仕様書作成',
    [Phase.UNIT_TEST]: '単体テスト',
    [Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION]: '内部結合テスト仕様書作成',
    [Phase.INTEGRATION_TEST_INTERNAL]: '内部結合テスト',
    [Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION]: '外部結合テスト仕様書作成',
    [Phase.INTEGRATION_TEST_EXTERNAL]: '外部結合テスト',
};

export const phaseNameShortMap: Record<PhaseEnum, string> = {
    [Phase.REQUIREMENTS_DEFINITION]: '要件',
    [Phase.DESIGN]: '設計',
    [Phase.DEVELOPMENT]: '製造',
    [Phase.UNIT_TEST_DOCUMENT_CREATION]: '単体仕様',
    [Phase.UNIT_TEST]: '単体',
    [Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION]: '内結仕様',
    [Phase.INTEGRATION_TEST_INTERNAL]: '内結',
    [Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION]: '外結仕様',
    [Phase.INTEGRATION_TEST_EXTERNAL]: '外結',
};