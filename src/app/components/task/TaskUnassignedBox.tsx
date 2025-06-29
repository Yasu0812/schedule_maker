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


    return (
        <>
            <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Unassigned Tasks</h2>
                <TaskFilter filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
            </div>
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