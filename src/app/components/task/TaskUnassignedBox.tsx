import { TaskManager } from "@/app/models/TaskManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { UUID } from "@/app/common/IdUtil";
import UnassignedTasks from "./UnassignedTasks";

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
        <div className="common-box" style={{ width: "100%", height: "100%" }}>
            <h1>Unassigned Tasks </h1>
            <div style={{ display: "flex", flexWrap: "wrap", width: "100%", height: "100%" }}>
                <UnassignedTasks
                    unassignedTasks={unassignedTasks}
                    taskManager={taskManager}
                    moveTargetTaskId={moveTargetTaskId}
                    setTaskManager={setTaskManager}
                    handleMoveTargetTask={handleMoveTargetTask}
                />
            </div>
        </div>
    );
}