import { UUID } from "@/app/common/IdUtil";
import { JellyBean } from "../decorator/JellyBean";

export default function TaskBeanDiv(props: {
    task: { taskId: UUID, taskName: string, taskPhase: string };
    duration: number;
    moveTargetTaskId: UUID | undefined;
    handleMouseDown?: () => void;
    handleContextMenu?: () => void;
    isFinishedBeforePhase?: boolean;

}) {
    const { task, duration, moveTargetTaskId } = props;

    const handleMouseDown = props.handleMouseDown || (() => { });
    const handleContextMenu = props.handleContextMenu || (() => { });
    const isFinishedBeforePhase = props.isFinishedBeforePhase || false;
    const isSelected = moveTargetTaskId === task?.taskId;
    const pointerEvents = isSelected ? "none" : "auto";

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return;
        handleMouseDown();
    };

    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        handleContextMenu();
    };

    return (
        <div
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}
            style={{ width: 100 * duration, height: "100%", zIndex: 1, userSelect: "none", pointerEvents: pointerEvents }}
        >
            <JellyBean width={100 * duration} height={36} phase={task?.taskPhase} selected={isSelected} >
                &nbsp;{task?.taskName} {isFinishedBeforePhase ? "❗️" : ""}
            </JellyBean>
        </ div>
    );
}