import { CalendarCellTask, CalendarLineTask } from "@/app/models/CalendarCellTask";
import CalendarLine from "./CalendarLine";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";


export default function CalendarLineBox(
    props: {
        dayListItems: Date[],
        memberList: readonly string[],
        allTaskMap: Map<string, CalendarLineTask>,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {
    const dayList = props.dayListItems;
    const memberList = props.memberList;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const moveTargetTaskId = props.moveTargetTaskId;

    const calendarLineItems = memberList.map((member, index) => {
        const taskMap = props.allTaskMap.get(member) || new CalendarLineTask(member, new Map<string, CalendarCellTask>());
        return (
            <CalendarLine
                key={index}
                rowIndex={index}
                dayListItems={dayList}
                member={member}
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
