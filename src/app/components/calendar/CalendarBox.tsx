import CalendarHeader from "./CalendarHeader";
import CalendarLineBox from "./CalendarLineBox";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { TaskManager } from "@/app/models/TaskManager";
import { MemberManager } from "@/app/models/MemberManager";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { MileStoneLine } from "./MileStoneLine";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import CalendarPreference from "./CalendarPreference";

export default function CalendarBox(
    props: {
        calendarManager: CalendarCellTaskManager,
        memberManager: MemberManager,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        mileStoneManager: MileStoneManager,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        setMemberManager: (memberManager: MemberManager) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        scheduleConfiguration: ScheduleConfiguration,
        handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
        children?: React.ReactNode,
    }
) {

    const {
        calendarManager,
        memberManager,
        taskManager,
        planedTaskManager,
        mileStoneManager,
        setPlanedTaskManager,
        setMemberManager,
        moveTargetTaskId,
        handleMoveTargetTask,
        scheduleConfiguration,
        handleScheduleConfigurationChange,
    } = props;
    const dayList = calendarManager.dayList;

    const allTaskMap = calendarManager.getAllCalendarLineMap();

    return (
        <div>
            <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Schedule</h2>
                <CalendarPreference
                    scheduleConfiguration={scheduleConfiguration}
                    handleScheduleConfigurationChange={handleScheduleConfigurationChange}
                />
            </div>
            <table className="calendar-box">
                <thead>
                    <MileStoneLine
                        mileStoneManager={mileStoneManager}
                        dayListItems={dayList} />
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
                        scheduleConfiguration={scheduleConfiguration}

                    />
                </tbody>
            </table>
            {props.children}
        </div>
    );
}
