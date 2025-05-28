import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";
import CardDesign from "../decorator/CardDesign";
import { UnassignedTaskService } from "@/app/service/UnassignedTaskService";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";

export default function TaskUnassignedBox(props: {
    taskManager: TaskManager,
    planedTaskManager: PlanedTask,
    calendarManager: CalendarCellTaskManager,
    setTaskManager: (taskManager: TaskManager) => void,
    moveTargetTaskId: UUID | undefined,
    handleMoveTargetTask: (taskId: UUID | undefined) => void,
    setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
}) {

    const { taskManager, planedTaskManager, setTaskManager, moveTargetTaskId, handleMoveTargetTask, calendarManager, setPlanedTaskManager } = props;

    const unassignedTasks = new UnassignedTaskService().getUnassignedTasks(
        taskManager,
        planedTaskManager
    );

    return (
        <CardDesign>
            <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Unassigned Tasks </h2>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }}>
                <UnassignedTasks
                    unassignedTasks={unassignedTasks}
                    taskManager={taskManager}
                    moveTargetTaskId={moveTargetTaskId}
                    planedTaskManager={planedTaskManager}
                    calandarManager={calendarManager}
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                    setPlanedTaskManager={setPlanedTaskManager}
                />
            </div>
        </CardDesign>
    );
}