import { generateUUID, UUID } from "../common/IdUtil";

export interface ITaskInformation {
    id: UUID;
    taskName: string;
    description: string;
    premiseTaskIds: UUID[];
    groupTaskId?: string;
}

export class TaskInformation implements ITaskInformation {
    /**
     * タスクの詳細情報を表すクラス。
     * @param id タスク情報のID
     * @param taskName タスクの名前
     * @param description タスクの説明
     * @param premiseTaskIds 前提タスクのIDリスト
     * @param groupTaskId グループタスクのID 同じグループIDを持つタスクは、同一人物が担当しなければならない groupTaskIdが指定されていない場合は、この制約は存在しない
     */
    constructor(
        public readonly id: UUID,
        public readonly taskName: string,
        public readonly description: string,
        public readonly premiseTaskIds: UUID[],
        public readonly groupTaskId?: string,

    ) { }

    public static createEmpty(): TaskInformation {
        return new TaskInformation(
            generateUUID(),
            "",
            "",
            []
        );
    }
    
}