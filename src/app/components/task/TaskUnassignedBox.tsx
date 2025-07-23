import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { TicketManager } from "@/app/models/Ticket";
import TaskFilter from "./TaskFilter";
import { orderedPhases } from "@/app/common/PhaseEnum";
import { useState } from "react";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { JellyBean } from "../decorator/JellyBean";
import { MemberManager } from "@/app/models/MemberManager";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { FilterOptions } from "@/app/types/FilterOptions";

export default function TaskUnassignedBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    memberManager: MemberManager,
    planedTaskManager: PlanedTask,
    mileStoneManager: MileStoneManager,
    scheduleConfiguration: ScheduleConfiguration,
    setTaskManager: (taskManager: TaskManager) => void,
    moveTargetTaskId: UUID | undefined,
    handleMoveTargetTask: (taskId: UUID | undefined) => void,
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
}) {


    const {
        ticketManager,
        taskManager,
        memberManager,
        planedTaskManager,
        setTaskManager,
        moveTargetTaskId,
        handleMoveTargetTask,
        setPlanedTaskManager,
        mileStoneManager,
        scheduleConfiguration
    } = props;

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        phase: orderedPhases,
        title: ''
    });

    const unassignedTasks = new UnassignedTaskService().getUnassignedTasks(
        taskManager,
        planedTaskManager,
        filterOptions,
        undefined,
        ticketManager.getExclusiveTicketIds(),
    );

    const fullAutoAssign = () => {
        const newPlanedManager = new TaskAssignmentService().fullAutoAssignTask(
            planedTaskManager,
            taskManager,
            mileStoneManager,
            memberManager,
            scheduleConfiguration,
            ticketManager.getExclusiveTicketIds(),
            filterOptions
        );
        setPlanedTaskManager(newPlanedManager);
    }

    const allCancelTasks = () => {
        if (confirm("Are you sure you want to cancel all tasks? This action cannot be undone.")) {
            const newPlanedManager = new TaskAssignmentService().allCancelTasks();
            setPlanedTaskManager(newPlanedManager);
        }
    }


    return (
        <>
            <div className="flex items-center gap-4 border-b pb-2">
                <h2 className="text-lg font-semibold">Unassigned Tasks</h2>
                <TaskFilter filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                <div onClick={fullAutoAssign}>
                    <JellyBean width={100} height={100} phase={""} selected={false} disabled={unassignedTasks.length === 0} className="bg-blue-500 hover:bg-blue-700 text-white font-bold">
                        <button
                            disabled={unassignedTasks.length === 0}
                        >
                            Assign<br />All Tasks
                        </button>
                    </JellyBean>
                </div>
                <div onClick={allCancelTasks}>
                    <JellyBean width={100} height={100} phase={""} selected={false} disabled={false} className="bg-red-500 hover:bg-red-700 text-white font-bold">
                        <button
                        >
                            Cancel<br />All Tasks
                        </button>
                    </JellyBean>
                </div>

            </div >
            <div className="overflow-x-hidden h-48 overflow-y-auto py-4" style={{ display: "flex", flexWrap: "wrap" }}>
                <UnassignedTasks
                    ticketManager={ticketManager}
                    unassignedTasks={unassignedTasks}
                    taskManager={taskManager}
                    memberManager={memberManager}
                    moveTargetTaskId={moveTargetTaskId}
                    planedTaskManager={planedTaskManager}
                    mileStoneManager={mileStoneManager}
                    scheduleConfiguration={scheduleConfiguration}
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                    setPlanedTaskManager={setPlanedTaskManager}
                />
            </div>
        </>
    );
}