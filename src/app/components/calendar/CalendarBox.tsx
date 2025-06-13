import CalendarHeader from "./CalendarHeader";
import CalendarLineBox from "./CalendarLineBox";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { TaskManager } from "@/app/models/TaskManager";
import { MemberManager } from "@/app/models/MemberManager";

export default function CalendarBox(
    props: {
        calendarManager: CalendarCellTaskManager,
        memberManager: MemberManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        setMemberManager: (memberManager: MemberManager) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        children?: React.ReactNode,
    }
) {

    const {
        calendarManager,
        memberManager,
        taskManager,
        planedTaskManager,
        setPlanedTaskManager,
        setMemberManager,
        moveTargetTaskId,
        handleMoveTargetTask,
    } = props;
    const dayList = calendarManager.dayList;

    const allTaskMap = calendarManager.getAllCalendarLineMap();

    return (
        <div>
            <table className="calendar-box">
                <thead>
                    <CalendarHeader dayListItems={dayList} />
                </thead>
                <tbody>
                    <CalendarLineBox
                        dayListItems={dayList}
                        memberManager={memberManager}
                        allTaskMap={allTaskMap}
                        taskManager={taskManager}
                        planedTaskManager={planedTaskManager}
                        setPlanedTaskManager={setPlanedTaskManager}
                        setMemberManager={setMemberManager}
                        moveTargetTaskId={moveTargetTaskId}
                        handleMoveTargetTask={handleMoveTargetTask}

                    />
                </tbody>
            </table>
            {props.children}
        </div>
    );
}
