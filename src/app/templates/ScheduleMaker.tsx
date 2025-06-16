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
import TicketRegistrationBox from "../components/ticket/TicketRegistrationBox";
import { MemberManager } from "../models/MemberManager";
import MemberAddForm from "../components/member/MemberAddForm";
import { ScheduleStateJson } from "../models/serialize/ScheduleStateJson";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";

export default function ScheduleMaker(
    props: {
        schdule: ScheduleStateManager,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
    }
) {

    const { schdule, setSchedule } = props;

    const [moveTargetTaskId, setMoveTargetTaskId] = useState<UUID | undefined>();

    const handleTicketManagerChange = useCallback((ticketManager: TicketManager) => {
        setSchedule((prevSchedule) => {
            if (!prevSchedule) return prevSchedule;

            return new ScheduleStateManager(
                prevSchedule.calandarManager,
                prevSchedule.taskManager,
                ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
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
            );

            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                planedTaskManager,
                prevSchedule.memberManager,
                prevSchedule.scheduleConfiguration,
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
            );
            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                memberManager,
                prevSchedule.scheduleConfiguration,
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
            );
            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
                prevSchedule.memberManager,
                scheduleConfiguration,
            );
        });
    }, [setSchedule])




    const handleMoveTargetTask = useCallback((taskId: UUID | undefined) => {
        setMoveTargetTaskId(taskId);
    }, []);

    return (
        <div className="flex flex-wrap" style={{ padding: '0.5rem', backgroundColor: '#cccccc' }}>
            <div style={{ width: '100%' }}>
                <CardDesign>
                    <div style={{ display: 'flex', overflow: 'scroll' }}>
                        <CalendarBox
                            calendarManager={schdule.calandarManager}
                            memberManager={schdule.memberManager}
                            taskManager={schdule.taskManager}
                            planedTaskManager={schdule.planedTaskManager}
                            setPlanedTaskManager={handlePlanedTaskManagerChange}
                            setMemberManager={handleMemberManagerChange}
                            moveTargetTaskId={moveTargetTaskId}
                            handleMoveTargetTask={handleMoveTargetTask}
                            scheduleConfiguration={schdule.scheduleConfiguration}
                            handleScheduleConfigurationChange={handleScheduleConfigurationChange}
                        >
                            <MemberAddForm memberManager={schdule.memberManager} handleMemberManagerChange={handleMemberManagerChange} />
                        </CalendarBox>

                    </div>
                </CardDesign>
            </div>
            {process.env.NODE_ENV === "development" && (
                <div style={{
                    position: 'fixed',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.8)',
                    color: '#0f0',
                    padding: '1rem',
                    borderRadius: '10px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    maxWidth: '500px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    zIndex: 9999,
                    boxShadow: '0 0 10px #0f0'
                }}>
                    <strong>🛠 Debug State</strong>
                    <pre>{JSON.stringify(moveTargetTaskId, null, 2)}</pre>
                    <pre>{schdule && ScheduleStateJson.toJson(schdule)}</pre>
                </div>
            )}

            <GhostJelly taskId={moveTargetTaskId} taskManager={schdule.taskManager} />

            <div className="w-full">
                <TaskUnassignedBox
                    taskManager={schdule.taskManager}
                    memberids={schdule.memberManager.ids}
                    planedTaskManager={schdule.planedTaskManager}
                    calendarManager={schdule.calandarManager}
                    setTaskManager={handleTaskManagerChange}
                    moveTargetTaskId={moveTargetTaskId}
                    handleMoveTargetTask={handleMoveTargetTask}
                    setPlanedTaskManager={handlePlanedTaskManagerChange}
                />
            </div>
            <div className="w-1/3">
                <CardDesign>
                    <TicketRegistrationBox
                        ticketManager={schdule.ticketManager}
                        taskManager={schdule.taskManager}
                        setTicketManager={handleTicketManagerChange}
                        setTaskManager={handleTaskManagerChange}
                    />
                </CardDesign>
            </div>
            <div className="w-2/3">
                <TicketManagementBox
                    ticketManager={schdule.ticketManager}
                    taskManager={schdule.taskManager}
                    planedTask={schdule.planedTaskManager}
                    setTicketManager={handleTicketManagerChange}
                    setTaskManager={handleTaskManagerChange}
                    setPlanedTask={handlePlanedTaskManagerChange}
                />
            </div>



        </div>

    );
}