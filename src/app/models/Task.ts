import { generateUUID, UUID } from "../common/IdUtil";
import { PhaseEnum } from "../common/PhaseEnum";
import { TaskInformation } from "./TaskInformation";

/**
 * メンバーが実際に実行するべきタスクを表す。
 * このタスクが何のチケットの詳細に相当するかは、
 * チケットのIDとPhaseEnumで表す。
 * @param id タスクのID
 * @param ticketId チケットのID
 * @param phase タスクのフェーズ
 * @param duration タスクの所要日数
 */
export class Task {
    constructor(
        public readonly id: UUID,
        public readonly ticketId: UUID,
        public readonly ticketTitle: string,
        public readonly phase: PhaseEnum,
        public readonly duration: number,
        public readonly taskInformation: TaskInformation,
    ) { }

    public static create(
        ticketId: UUID,
        ticketTitle: string,
        phase: PhaseEnum,
        duration: number,
        taskInformation: {
            taskName: string,
            description?: string,
            premiseTaskIds?: UUID[],
            groupTaskId?: string, // グループタスクID
        },
    ): Task {
        return new Task(generateUUID(), ticketId, ticketTitle, phase, duration, {
            id: generateUUID(),
            taskName: taskInformation.taskName,
            description: taskInformation.description || "",
            premiseTaskIds: taskInformation.premiseTaskIds || [],
            groupTaskId: taskInformation.groupTaskId,
        });
    }

}

