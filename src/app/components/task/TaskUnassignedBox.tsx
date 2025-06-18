import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";

export default function TaskUnassignedBox(props: {
    taskManager: TaskManager,
    memberids: UUID[],
    planedTaskManager: PlanedTask,
    calendarManager: CalendarCellTaskManager,
    setTaskManager: (taskManager: TaskManager) => void,
    moveTargetTaskId: UUID | undefined,
    handleMoveTargetTask: (taskId: UUID | undefined) => void,
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
}) {

    const { taskManager, memberids, planedTaskManager, setTaskManager, moveTargetTaskId, handleMoveTargetTask, calendarManager, setPlanedTaskManager } = props;

    const unassignedTasks = new UnassignedTaskService().getUnassignedTasks(
        taskManager,
        planedTaskManager
    );

    return (
        <>
            <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Unassigned Tasks </h2>
            </div>
            <div className="overflow-x-hidden" style={{ display: "flex", flexWrap: "wrap" }}>
                <UnassignedTasks
                    unassignedTasks={unassignedTasks}
                    taskManager={taskManager}
                    memberids={memberids}
                    moveTargetTaskId={moveTargetTaskId}
                    planedTaskManager={planedTaskManager}
                    calandarManager={calendarManager}
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                    setPlanedTaskManager={setPlanedTaskManager}
                />
            </div>
        </>
    );
}