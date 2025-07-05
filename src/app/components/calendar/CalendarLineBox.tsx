import { CalendarCellTask, CalendarLineTask } from "@/app/models/CalendarCellTask";
import CalendarLine from "./CalendarLine";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { MemberManager } from "@/app/models/MemberManager";
import { useState } from "react";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";


export default function CalendarLineBox(
    props: {
        dayListItems: Date[],
        memberManager: MemberManager,
        allTaskMap: Map<string, CalendarLineTask>,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        setMemberManager: (memberManager: MemberManager) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        scheduleConfiguration: ScheduleConfiguration,
    }
) {
    const dayList = props.dayListItems;
    const memberManager = props.memberManager;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const moveTargetTaskId = props.moveTargetTaskId;
    const memberIds = memberManager.ids;
    const scheduleConfiguration = props.scheduleConfiguration;

    const [editingMemberId, setEditingMemberId] = useState<UUID | undefined>(undefined);

    const handleEditMember = (memberId: UUID | undefined) => {
        setEditingMemberId(memberId);
    };


    const calendarLineItems = memberIds.map((memberId) => {
        const taskMap = props.allTaskMap.get(memberId) || new CalendarLineTask(memberId, new Map<string, CalendarCellTask>());
        const member = memberManager.getMember(memberId)?.name;
        const isEditing = editingMemberId === memberId;
        return (
            <CalendarLine
                key={memberId}
                dayListItems={dayList}
                member={member}
                memberId={memberId}
                lineTask={taskMap}
                taskManager={props.taskManager}
                planedTaskManager={props.planedTaskManager}
                setPlanedTaskManager={props.setPlanedTaskManager}
                memberManager={memberManager}
                setMemberManager={props.setMemberManager}
                moveTargetTaskId={moveTargetTaskId}
                handleMoveTargetTask={handleMoveTargetTask}
                isEditing={isEditing}
                handleEditMember={handleEditMember}
                scheduleConfiguration={scheduleConfiguration}

            />
        );
    });

    return (
        <>
            {calendarLineItems}
        </>
    );
}
