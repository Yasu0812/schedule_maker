export const TicketAssignStatus = {
    NONE: "none", // タスクが存在しない状態
    DISABLE: "disable", // タスクを割り当てることができない状態
    STARTABLE: "startable", // タスクを割り当てることができる状態
    FULL: "full",  // タスクが割り当てられた状態
    VIOLATION: "violation", // タスクの割り当てが違反している状態

} as const;

export type TicketAssignStatusEnum = typeof TicketAssignStatus[keyof typeof TicketAssignStatus];