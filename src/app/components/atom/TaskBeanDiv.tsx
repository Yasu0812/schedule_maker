import { UUID } from "@/app/common/IdUtil";
import { JellyBean } from "../decorator/JellyBean";

export default function TaskBeanDiv(props: {
    task: { taskId: UUID, taskName: string, taskPhase: string };
    duration: number;
    moveTargetTaskId: UUID | undefined;
    handleMouseDown?: () => void;
    handleContextMenu?: () => void;
    isTaskAssignableDay?: {
        isAssignable: boolean,
        reason?: string,
    }

}) {
    const { task, duration, moveTargetTaskId } = props;

    const handleMouseDown = props.handleMouseDown || (() => { });
    const handleContextMenu = props.handleContextMenu || (() => { });
    const isAssignable = props.isTaskAssignableDay === undefined || props.isTaskAssignableDay.isAssignable;
    const reason = props.isTaskAssignableDay?.reason;
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
            style={{ width: 75 * duration, height: "100%", zIndex: 1, userSelect: "none", pointerEvents: pointerEvents }}
            title={reason}
        >
            <JellyBean width={75 * duration} height={36} phase={task?.taskPhase} selected={isSelected} >
                {task?.taskName} {isAssignable ? "" : "❗️"}
            </JellyBean>
        </ div>
    );
}