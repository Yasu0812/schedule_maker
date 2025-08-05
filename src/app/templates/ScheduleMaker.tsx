import { Dispatch, SetStateAction, useCallback, useState } from "react";
import CalendarBox from "../components/calendar/CalendarBox";
import TicketManagementBox from "../components/ticket/TicketManagementBox";
import { TicketManager } from "../models/Ticket";
import { ScheduleStateManager } from "../models/ScheduleStateManager";
import { TaskManager } from "../models/TaskManager";
import TaskUnassignedBox from "../components/task/TaskUnassignedBox";
import { PlanedTask } from "../models/PlanedTask";
import { GetCalendarService } from "../service/GetCalendarService";
import { UUID } from "../common/IdUtil";
import { GhostJelly } from "../components/ghostTask/GhostJelly";
import CardDesign from "../components/decorator/CardDesign";
import { MemberManager } from "../models/MemberManager";
import MemberAddForm from "../components/member/MemberAddForm";
import { ScheduleStateJson } from "../models/serialize/ScheduleStateJson";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";
import MileStoneConfig from "../components/milestone/MileStoneConfig";
import { MileStoneManager } from "../models/MileStoneManager";
import DebugState from "../components/debug/DebugState";
import GanttChart from "./GanttChart";

export default function ScheduleMaker(
    props: {
        schedule: ScheduleStateManager,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
    }
) {

    const { schedule, setSchedule } = props;

    const [moveTargetTaskId, setMoveTargetTaskId] = useState<UUID | undefined>();

    const handleTicketManagerChange = useCallback((ticketManager: TicketManager) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            const newCalendarManager = new GetCalendarService().fromPlanedDatas(
                prevSchedule.scheduleConfiguration.firstDate,
                prevSchedule.scheduleConfiguration.lastDate,
                prevSchedule.memberManager,
                ticketManager,
                prevSchedule.taskManager,
                prevSchedule.planedTaskManager,
                prevSchedule.mileStoneManager,
                prevSchedule.scheduleConfiguration
            );

            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
                prevSchedule.mileStoneManager,
            );
        });
    }, [setSchedule]);

    const handleTaskManagerChange = useCallback((taskManager: TaskManager) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            return new ScheduleStateManager(
                prevSchedule.calandarManager,
                taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
                prevSchedule.mileStoneManager,
            );
        });
    }, [setSchedule]);

    const handlePlanedTaskManagerChange = useCallback((planedTaskManager: PlanedTask) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            const newCalendarManager = new GetCalendarService().fromPlanedDatas(
                prevSchedule.scheduleConfiguration.firstDate,
                prevSchedule.scheduleConfiguration.lastDate,
                prevSchedule.memberManager,
                prevSchedule.ticketManager,
                prevSchedule.taskManager,
                planedTaskManager,
                prevSchedule.mileStoneManager,
                prevSchedule.scheduleConfiguration
            );

            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
                prevSchedule.mileStoneManager,
            );
        });
    }, [setSchedule])

    const handleMemberManagerChange = useCallback((memberManager: MemberManager) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            const newCalendarManager = new GetCalendarService().fromPlanedDatas(
                prevSchedule.scheduleConfiguration.firstDate,
                prevSchedule.scheduleConfiguration.lastDate,
                memberManager,
                prevSchedule.ticketManager,
                prevSchedule.taskManager,
                prevSchedule.planedTaskManager,
                prevSchedule.mileStoneManager,
                prevSchedule.scheduleConfiguration
            );
            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                memberManager,
                prevSchedule.scheduleConfiguration,
                prevSchedule.mileStoneManager,
            );
        });
    }, [setSchedule])


    const handleScheduleConfigurationChange = useCallback((scheduleConfiguration: ScheduleConfiguration) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            const newCalendarManager = new GetCalendarService().fromPlanedDatas(
                scheduleConfiguration.firstDate,
                scheduleConfiguration.lastDate,
                prevSchedule.memberManager,
                prevSchedule.ticketManager,
                prevSchedule.taskManager,
                prevSchedule.planedTaskManager,
                prevSchedule.mileStoneManager,
                scheduleConfiguration
            );
            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                scheduleConfiguration,
                prevSchedule.mileStoneManager,
            );
        });
    }, [setSchedule])

    const handleMilestoneManagerChange = useCallback((mileStoneManager: MileStoneManager) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            return new ScheduleStateManager(
                prevSchedule.calandarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
                mileStoneManager,
            );
        });
    }, [setSchedule]);


    const handleMoveTargetTask = useCallback((taskId: UUID | undefined) => {
        setMoveTargetTaskId(taskId);
    }, []);

    return (
        <div className="flex flex-wrap" style={{ backgroundColor: '#cccccc' }}>
            <div style={{ width: '100%' }}>
                <CardDesign>
                    <CalendarBox
                        calendarManager={schedule.calandarManager}
                        ticketManager={schedule.ticketManager}
                        memberManager={schedule.memberManager}
                        taskManager={schedule.taskManager}
                        planedTaskManager={schedule.planedTaskManager}
                        mileStoneManager={schedule.mileStoneManager}
                        setPlanedTaskManager={handlePlanedTaskManagerChange}
                        setMemberManager={handleMemberManagerChange}
                        moveTargetTaskId={moveTargetTaskId}
                        handleMoveTargetTask={handleMoveTargetTask}
                        scheduleConfiguration={schedule.scheduleConfiguration}
                        handleScheduleConfigurationChange={handleScheduleConfigurationChange}
                    >
                        <MemberAddForm memberManager={schedule.memberManager} handleMemberManagerChange={handleMemberManagerChange} />
                    </CalendarBox>

                </CardDesign>
            </div>
            {process.env.NODE_ENV === "development" && (
                <DebugState>
                    <>
                        <pre>{JSON.stringify(moveTargetTaskId, null, 2)}</pre>
                        <pre>{schedule && ScheduleStateJson.toJson(schedule)}</pre>
                    </>
                </DebugState>
            )}

            <GhostJelly taskId={moveTargetTaskId} ticketManager={schedule.ticketManager} taskManager={schedule.taskManager} />

            <div className="w-full">
                <CardDesign>
                    <TaskUnassignedBox
                        ticketManager={schedule.ticketManager}
                        taskManager={schedule.taskManager}
                        memberManager={schedule.memberManager}
                        planedTaskManager={schedule.planedTaskManager}
                        mileStoneManager={schedule.mileStoneManager}
                        scheduleConfiguration={schedule.scheduleConfiguration}
                        setTaskManager={handleTaskManagerChange}
                        moveTargetTaskId={moveTargetTaskId}
                        handleMoveTargetTask={handleMoveTargetTask}
                        setPlanedTaskManager={handlePlanedTaskManagerChange}
                    />
                </CardDesign>

            </div>
            <div className="w-2/3">
                <TicketManagementBox
                    ticketManager={schedule.ticketManager}
                    taskManager={schedule.taskManager}
                    planedTask={schedule.planedTaskManager}
                    scheduleConfiguration={schedule.scheduleConfiguration}
                    setTicketManager={handleTicketManagerChange}
                    setTaskManager={handleTaskManagerChange}
                    setPlanedTask={handlePlanedTaskManagerChange}
                />
            </div>
            <div className="w-1/3">
                <CardDesign>
                    <MileStoneConfig
                        mileStoneManager={schedule.mileStoneManager}
                        setMileStoneManager={handleMilestoneManagerChange}
                    />
                </CardDesign>
            </div>
        </div>

    );
}