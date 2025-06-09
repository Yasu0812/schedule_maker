import { CalendarCellTask, CalendarLineTask } from "@/app/models/CalendarCellTask";
import CalendarLine from "./CalendarLine";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { MemberManager } from "@/app/models/MemberManager";


export default function CalendarLineBox(
    props: {
        dayListItems: Date[],
        memberManager: MemberManager,
        allTaskMap: Map<string, CalendarLineTask>,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {
    const dayList = props.dayListItems;
    const memberManager = props.memberManager;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const moveTargetTaskId = props.moveTargetTaskId;
    const memberIds = memberManager.ids;

    const calendarLineItems = memberIds.map((memberId) => {
        const taskMap = props.allTaskMap.get(memberId) || new CalendarLineTask(memberId, new Map<string, CalendarCellTask>());
        const member = memberManager.getMember(memberId);
        return (
            <CalendarLine
                key={memberId}
                dayListItems={dayList}
                member={member}
                memberId={memberId}
                lineTask={taskMap}
                taskManager={props.taskManager}
                planedTaskManager={props.planedTaskManager}
                setPlanedTaskManager={props.setPlanedTaskManager}
                moveTargetTaskId={moveTargetTaskId}
                handleMoveTargetTask={handleMoveTargetTask}
            />
        );
    });

    return (
        <>
            {calendarLineItems}
        </>
    );
}
