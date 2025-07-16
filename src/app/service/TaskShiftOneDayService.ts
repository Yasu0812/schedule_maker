import { UUID } from "crypto";
import { PlanedTask } from "../models/PlanedTask";
import { TaskManager } from "../models/TaskManager";
import TaskAssignablePolicy from "../models/TaskAssignablePolicy";
import { MileStoneManager } from "../models/MileStoneManager";
import { MemberManager } from "../models/MemberManager";
import { ScheduleConfiguration } from "../models/ScheduleConfiguration";
import { TicketManager } from "../models/Ticket";
import DurationDayCalc from "../models/DurationDayCalc";


export class TaskShiftOneDayService {

    private _taskAssignablePolicy = new TaskAssignablePolicy();

    private _durationDayCalc = new DurationDayCalc();

    public shiftTaskOneDay(
        assignedId: UUID,
        planedTask: PlanedTask,
        scheduleConfiguration: ScheduleConfiguration // Assuming ScheduleConfiguration is not needed for this operation
    ): PlanedTask {
        const assignedTask = planedTask.getFromAssignedId(assignedId);
        if (!assignedTask) {
            throw new Error(`Assigned task not found: ${assignedId}`);
        }

        // Shift the start and end dates by one day
        const startDay = this._durationDayCalc.getPreviousWorkingDay(assignedTask.startDay, scheduleConfiguration.additionalHolidays);
        const endDay = this._durationDayCalc.getPreviousWorkingDay(assignedTask.endDay, scheduleConfiguration.additionalHolidays);

        // Update the task in the planed tasks
        planedTask.assignTask(
            {
                id: assignedTask.taskId,
                ticketId: assignedTask.ticketId
            },
            assignedTask.memberId,
            startDay,
            endDay
        );

        return planedTask;
    }

    public isShiftable(
        assignedId: UUID,
        planedTask: PlanedTask,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        memberManager: MemberManager,
        mileStoneManager: MileStoneManager,
        scheduleConfiguration: ScheduleConfiguration
    ): boolean {
        const assignedTask = planedTask.getFromAssignedId(assignedId);
        if (!assignedTask) {
            throw new Error(`Assigned task not found: ${assignedId}`);
        }
        const member = memberManager.getMember(assignedTask.memberId);
        if (!member) {
            throw new Error(`Member not found: ${assignedTask.memberId}`);
        }
        const startDay = this._durationDayCalc.getPreviousWorkingDay(assignedTask.startDay, scheduleConfiguration.additionalHolidays);
        const endDay = this._durationDayCalc.getPreviousWorkingDay(assignedTask.endDay, scheduleConfiguration.additionalHolidays);

        const { isAssignable } = this._taskAssignablePolicy.isTaskAssignable(
            assignedTask.taskId,
            startDay,
            endDay,
            planedTask,
            taskManager,
            mileStoneManager,
            member,
            scheduleConfiguration.firstDate,
            scheduleConfiguration.lastDate,
            ticketManager.getExclusiveTicketIds()
        )
        return isAssignable;
    }

    public shiftAllTasksOneDay(
        planedTask: PlanedTask,
        ticketManager: TicketManager,
        taskManager: TaskManager,
        memberManager: MemberManager,
        mileStoneManager: MileStoneManager,
        scheduleConfiguration: ScheduleConfiguration
    ): PlanedTask {
        let result: PlanedTask = planedTask;
        let shiftedCount = 0;
        let loopCount = 0;
        do {
            const assignedTasks = result.getAll();
            shiftedCount = 0;
            for (const assignedTask of assignedTasks) {

                if (this.isShiftable(
                    assignedTask.id,
                    result,
                    ticketManager,
                    taskManager,
                    memberManager,
                    mileStoneManager,
                    scheduleConfiguration
                )) {
                    result = this.shiftTaskOneDay(
                        assignedTask.id,
                        result,
                        scheduleConfiguration
                    );
                    shiftedCount++;
                }
            }
            loopCount++;
            if (loopCount > 100) {
                throw new Error("Infinite loop detected in TaskShiftOneDayService.shiftAllTasksOneDay");
            }
            
        } while (shiftedCount > 0);

        return planedTask;
    }
}