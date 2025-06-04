export const PhaseStatus = {
    NONE: "none", // フェーズが存在しない
    PARTIAL: "partial", // 一部のタスクが割り当てられている
    UNASSIGNED: "unassigned", // タスクが存在するが、まだ割り当てられていない
    FULL: "full", // 全てのタスクが割り当てられている

} as const;

export type PhaseStatusEnum = typeof PhaseStatus[keyof typeof PhaseStatus];