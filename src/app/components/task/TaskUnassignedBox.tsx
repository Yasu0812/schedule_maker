import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";
import CardDesign from "../decorator/CardDesign";

export default function TaskUnassignedBox(props: {
    taskManager: TaskManager,
    planedTaskManager: PlanedTask,
    setTaskManager: (taskManager: TaskManager) => void,
    moveTargetTaskId: UUID | undefined,
    handleMoveTargetTask: (taskId: UUID | undefined) => void,
}) {

    const { taskManager, planedTaskManager, setTaskManager, moveTargetTaskId, handleMoveTargetTask } = props;

    const unassignedTasks = new PlanningStatusService().getUnassignedTask(
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
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                />
            </div>
        </CardDesign>
    );
}