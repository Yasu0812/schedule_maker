import { DateUtil } from "@/app/common/DateUtil";
import CalendarHeader from "./CalendarHeader";
import CalendarLineBox from "./CalendarLineBox";
import { useState } from "react";
import { SelectRange } from "@/app/models/SelectRange";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { TaskManager } from "@/app/models/TaskManager";

export default function CalendarBox(
    props: {
        calendarManager: CalendarCellTaskManager,
        setCalendarManager: (calendarManager: CalendarCellTaskManager) => void,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {

    const {
        calendarManager,
        setCalendarManager,
        taskManager,
        planedTaskManager,
        setPlanedTaskManager,
        moveTargetTaskId,
        handleMoveTargetTask,
    } = props;
    const dayList = DateUtil.generateDayList("2025-04-01", "2025-06-30");
    // const allTaskMap = CalendarCellTaskManager.createMockData().getAllCalendarLineMap();
    // const memberList = CalendarCellTaskManager.createMockData().memberList;

    const memberList = calendarManager.memberList;
    const allTaskMap = calendarManager.getAllCalendarLineMap();

    const getTaskDetails = (rowIndex: number, colIndex: number) => {
        const member = memberList[rowIndex];
        const day = DateUtil.formatDate(dayList[colIndex]);
        const task = allTaskMap.get(member)?.getTaskForDate(day);
        if (task) {
            return {
                taskName: task.taskName,
                taskPhase: task.taskPhase,
                taskDescription: task.taskDescription,
                member: member,
                startDate: task.taskDate,
            };
        }
    }

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
