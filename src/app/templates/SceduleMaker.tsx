import { useEffect, useState } from "react";
import CalendarBox from "../components/calendar/CalendarBox";
import TicketManagementBox from "../components/ticket/TicketManagementBox";
import { TicketManager } from "../models/Ticket";
import { ScheduleStateManager } from "../models/ScheduleStateManager";
import { CalendarCellTaskManager } from "../models/CalendarCellTask";
import { TaskManager } from "../models/TaskManager";
import TaskUnassignedBox from "../components/task/TaskUnassignedBox";
import { PlanedTask } from "../models/PlanedTask";
import { GetCalendarService } from "../service/GetCalendarService";
import { UUID } from "../common/IdUtil";
import { toSerializable } from "../common/JsonUtil";
import { GhostJelly } from "../components/ghostTask/GhostJelly";
import Legend from "../components/atom/Legend";

export default function SceduleMaker() {

    const [schdule, setSchedule] = useState<ScheduleStateManager>(ScheduleStateManager.ScheduleStateManagerFactory());
    const [moveTargetTaskId, setMoveTargetTaskId] = useState<UUID | undefined>();


    const handleTicketManagerChange = (ticketManager: TicketManager) => {
        setSchedule((prevSchedule) => {
            return new ScheduleStateManager(
                prevSchedule.calandarManager,
                prevSchedule.taskManager,
                ticketManager,
                prevSchedule.planedTaskManager,
            );
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCalendarManagerChange = (calendarManager: CalendarCellTaskManager) => {
        setSchedule((prevSchedule) => {
            return new ScheduleStateManager(
                calendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
            );
        });
    }

    const handleTaskManagerChange = (taskManager: TaskManager) => {
        setSchedule((prevSchedule) => {
            return new ScheduleStateManager(
                prevSchedule.calandarManager,
                taskManager,
                prevSchedule.ticketManager,
                prevSchedule.planedTaskManager,
            );
        });
    }

    const handlePlanedTaskManagerChange = (planedTaskManager: PlanedTask) => {
        setSchedule((prevSchedule) => {
            const newCalendarManager = new GetCalendarService().fromPlanedDatas(
                prevSchedule.calandarManager.firstDate,
                prevSchedule.calandarManager.lastDate,
                [...prevSchedule.calandarManager.memberList],
                prevSchedule.ticketManager,
                prevSchedule.taskManager,
                planedTaskManager,
            );

            return new ScheduleStateManager(
                newCalendarManager,
                prevSchedule.taskManager,
                prevSchedule.ticketManager,
                planedTaskManager,
            );
        });
    }

    useEffect(() => {
        localStorage.setItem('app-data', JSON.stringify(toSerializable(schdule)));
    }, [schdule]);

    const handleMoveTargetTask = (taskId: UUID | undefined) => {
        setMoveTargetTaskId(taskId);
    }

    return (
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
            <div style={{ display: 'flex', overflow: 'scroll', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <CalendarBox
                    calendarManager={schdule.calandarManager}
                    taskManager={schdule.taskManager}
                    planedTaskManager={schdule.planedTaskManager}
                    setPlanedTaskManager={handlePlanedTaskManagerChange}
                    moveTargetTaskId={moveTargetTaskId}
                    handleMoveTargetTask={handleMoveTargetTask}
                />

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
                    <pre>{JSON.stringify(toSerializable(schdule), null, 2)}</pre>
                </div>
            )}

            <GhostJelly taskId={moveTargetTaskId} taskManager={schdule.taskManager} />

            <TaskUnassignedBox
                taskManager={schdule.taskManager}
                planedTaskManager={schdule.planedTaskManager}
                calendarManager={schdule.calandarManager}
                setTaskManager={handleTaskManagerChange}
                moveTargetTaskId={moveTargetTaskId}
                handleMoveTargetTask={handleMoveTargetTask}
                setPlanedTaskManager={handlePlanedTaskManagerChange}
            />

            <TicketManagementBox
                ticketManager={schdule.ticketManager}
                taskManager={schdule.taskManager}
                setTicketManager={handleTicketManagerChange}
                setTaskManager={handleTaskManagerChange}
            />
            <Legend />
        </div>

    );
}