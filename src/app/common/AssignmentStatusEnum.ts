export const AssignmentStatus = {
    NONE: "none",
    PARTIAL: "partial",
    EXCESS: "excess",
    FULL: "full",

} as const;

export type AssignmentStatusEnum = typeof AssignmentStatus[keyof typeof AssignmentStatus];