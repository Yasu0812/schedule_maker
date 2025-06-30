import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { TicketManager } from "@/app/models/Ticket";
import TaskFilter from "./TaskFilter";
import { orderedPhases, PhaseEnum } from "@/app/common/PhaseEnum";
import { useState } from "react";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { JellyBean } from "../decorator/JellyBean";

export type FilterOptions = {
    phase: PhaseEnum[];
    title: string;
}

export default function TaskUnassignedBox(props: {
    ticketManager: TicketManager,
    taskManager: TaskManager,
    memberids: UUID[],
    planedTaskManager: PlanedTask,
    calendarManager: CalendarCellTaskManager,
    mileStoneManager: MileStoneManager,
    setTaskManager: (taskManager: TaskManager) => void,
    moveTargetTaskId: UUID | undefined,
    handleMoveTargetTask: (taskId: UUID | undefined) => void,
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
}) {


    const { ticketManager, taskManager, memberids, planedTaskManager, setTaskManager, moveTargetTaskId, handleMoveTargetTask, calendarManager, setPlanedTaskManager, mileStoneManager } = props;

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        phase: orderedPhases,
        title: ''
    });

    const unassignedTasks = new UnassignedTaskService().getUnassignedTasks(
        taskManager,
        planedTaskManager,
        ticketManager.ticketMap,
        filterOptions,
        ticketManager.getExclusiveTicketIds(),
    );

    const fullAutoAssign = () => {
        const newPlanedManager = new TaskAssignmentService().fullAutoAssignTask(
            planedTaskManager,
            taskManager,
            calendarManager,
            mileStoneManager,
            memberids,
            ticketManager.getExclusiveTicketIds(),
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
                <JellyBean width={100} height={100} phase={""} selected={false} disabled={unassignedTasks.length === 0} className="bg-blue-500 hover:bg-blue-700 text-white font-bold">
                    <button
                        disabled={unassignedTasks.length === 0}
                        onClick={fullAutoAssign}
                    >
                        Assign<br />All Tasks
                    </button>
                </JellyBean>
                <JellyBean width={100} height={100} phase={""} selected={false} disabled={false} className="bg-red-500 hover:bg-red-700 text-white font-bold">
                    <button
                        onClick={allCancelTasks}
                    >
                        Cancel<br />All Tasks
                    </button>
                </JellyBean>
            </div >
            <div className="overflow-x-hidden h-48 overflow-y-auto py-4" style={{ display: "flex", flexWrap: "wrap" }}>
                <UnassignedTasks
                    ticketManager={ticketManager}
                    unassignedTasks={unassignedTasks}
                    taskManager={taskManager}
                    memberids={memberids}
                    moveTargetTaskId={moveTargetTaskId}
                    planedTaskManager={planedTaskManager}
                    calandarManager={calendarManager}
                    mileStoneManager={mileStoneManager}
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                    setPlanedTaskManager={setPlanedTaskManager}
                />
            </div>
        </>
    );
}