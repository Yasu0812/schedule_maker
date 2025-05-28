import CalendarHeader from "./CalendarHeader";
import CalendarLineBox from "./CalendarLineBox";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { TaskManager } from "@/app/models/TaskManager";

export default function CalendarBox(
    props: {
        calendarManager: CalendarCellTaskManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {

    const {
        calendarManager,
        taskManager,
        planedTaskManager,
        setPlanedTaskManager,
        moveTargetTaskId,
        handleMoveTargetTask,
    } = props;
    const dayList = calendarManager.dayList;

    const memberList = calendarManager.memberList;
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
                        memberList={memberList}
                        allTaskMap={allTaskMap}
                        taskManager={taskManager}
                        planedTaskManager={planedTaskManager}
                        setPlanedTaskManager={setPlanedTaskManager}
                        moveTargetTaskId={moveTargetTaskId}
                        handleMoveTargetTask={handleMoveTargetTask}

                    />
                </tbody>

            </table>
        </div>
    );
}
