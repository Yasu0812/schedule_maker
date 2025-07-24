import { UUID } from "@/app/common/IdUtil";
import { JellyBean } from "../decorator/JellyBean";

export default function TaskBeanDiv(props: {
    task: { taskId: UUID, taskName: string, taskPhase: string };
    duration: number;
    moveTargetTaskId: UUID | undefined;
    isFiltered?: boolean;
    handleMouseDown?: () => void;
    handleContextMenu?: () => void;
    isTaskAssignableDay?: {
        isAssignable: boolean,
        reasons?: string[],
    }

}) {
    const { task, duration, moveTargetTaskId } = props;

    const handleMouseDown = props.handleMouseDown || (() => { });
    const handleContextMenu = props.handleContextMenu || (() => { });
    const isAssignable = props.isTaskAssignableDay === undefined || props.isTaskAssignableDay.isAssignable;
    const isFiltered = props.isFiltered === undefined || props.isFiltered;
    const reasons = props.isTaskAssignableDay?.reasons || [];
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
            style={{ width: 77 * duration - 2, height: "100%", zIndex: 1, userSelect: "none", pointerEvents: pointerEvents }}
            title={reasons.join("\n")}
        >
            <JellyBean width={77 * duration - 2} height={35} phase={task?.taskPhase} selected={isSelected} disabled={!isFiltered} >
                {task?.taskName} {isAssignable ? "" : "❗️".repeat(reasons.length)}
            </JellyBean>
        </ div>
    );
}