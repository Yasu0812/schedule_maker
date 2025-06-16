import CalendarHeader from "./CalendarHeader";
import CalendarLineBox from "./CalendarLineBox";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { TaskManager } from "@/app/models/TaskManager";
import { MemberManager } from "@/app/models/MemberManager";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { DateUtil } from "@/app/common/DateUtil";

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
                <h2 className="text-lg font-semibold">Schedule </h2>
                <input type="date" className="border rounded p-2"
                    value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.firstDate)}
                    onChange={(e) => {
                        const newFirstDate = DateUtil.parseDateWithHyphen(e.target.value);
                        const newConfig = scheduleConfiguration.updateFirstDate(newFirstDate);
                        handleScheduleConfigurationChange(newConfig);
                    }}
                />
                -

                <input type="date" className="border rounded p-2"
                    value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.lastDate)}
                    onChange={(e) => {
                        const newLastDate = DateUtil.parseDateWithHyphen(e.target.value);
                        const newConfig = scheduleConfiguration.updateLastDate(newLastDate);
                        handleScheduleConfigurationChange(newConfig);
                    }}
                />
            </div>
            <div className="flex items-center gap-2 mb-4">
            </div>
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
