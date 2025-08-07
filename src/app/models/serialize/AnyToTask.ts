import { generateUUID, UUID } from "@/app/common/IdUtil";
import { Task } from "../Task";
import { PhaseEnum } from "@/app/common/PhaseEnum";

export class AnyToTask {

    static toTask(any: unknown): Task {
        if (any instanceof Task) {
            return any;
        }
        if (typeof any === 'object' && any !== null) {
            const obj = any as {
                id: UUID;
                ticketId: UUID;
                ticketTitle: string;
                phase: PhaseEnum;
                duration: number;
                taskInformation?: {
                    id: UUID;
                    taskName: string;
                    description: string;
                    premiseTaskIds: UUID[];
                    groupTaskId: string;
                };
            };
            const task = new Task(
                obj.id,
                obj.ticketId,
                obj.ticketTitle,
                obj.phase,
                obj.duration,
                obj.taskInformation || { id: generateUUID(), taskName: '', description: '', premiseTaskIds: [], groupTaskId: '' }
            );

            return task;
        }
        throw new Error('Invalid input for Task conversion');
    }
}