import { Task } from "@/app/models/Task";
import { TaskMergeSplitService } from "@/app/service/TaskMergeSplitService";
import { TaskManager } from "@/app/models/TaskManager";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { PlanedTask } from "@/app/models/PlanedTask";
import { UUID } from "@/app/common/IdUtil";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { TicketManager } from "@/app/models/Ticket";
import { NameResolveService } from "@/app/service/NameResolveService";
import { MemberManager } from "@/app/models/MemberManager";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { useModal } from "../modal/ModalContext";
import TaskSplitModal from "./TaskSplitModal";

export default function UnassignedTasks(
    props: {
        ticketManager: TicketManager,
        unassignedTasks: Task[],
        memberManager: MemberManager,
        taskManager: TaskManager,
        moveTargetTaskId: UUID | undefined,
        planedTaskManager: PlanedTask,
        mileStoneManager: MileStoneManager,
        scheduleConfiguration: ScheduleConfiguration,
        setTaskManager: (taskManager: TaskManager) => void,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
    }
) {
    const {
        unassignedTasks,
        memberManager,
        taskManager,
        moveTargetTaskId,
        setTaskManager,
        handleMoveTargetTask,
        mileStoneManager,
        planedTaskManager,
        ticketManager,
        scheduleConfiguration,
        setPlanedTaskManager
    } = props;

    const { showModal, hideModal } = useModal();

    const onDoubleClick = (taskId: UUID) => {
        handleMoveTargetTask(undefined);
        showModal(() => <TaskSplitModal
            taskId={taskId}
            ticketManager={ticketManager}
            taskManager={taskManager}
            planedTaskManager={planedTaskManager}
            setTaskManager={setTaskManager}
            hideModal={hideModal}
        />);
    }

    const onMouseUp = (e: React.MouseEvent, taskId: UUID) => {
        if (!moveTargetTaskId) {
            return;
        }

        if (taskId === moveTargetTaskId) {
            handleMoveTargetTask(taskId);
            return;
        }

        const newTaskManager = new TaskMergeSplitService().mergeTasks([taskId, moveTargetTaskId], taskManager);
        setTaskManager(newTaskManager);

        handleMoveTargetTask(undefined);

    }

    const onMouseDown = (taskId: UUID) => {

        if (!moveTargetTaskId) {
            handleMoveTargetTask(taskId);
        } else if (isSameTaskId(taskId)) {
            handleMoveTargetTask(undefined);
        } else {
            const newTaskManager = new TaskMergeSplitService().mergeTasks([taskId, moveTargetTaskId], taskManager);
            setTaskManager(newTaskManager);

            handleMoveTargetTask(undefined);
        }

    }

    const onContextmenu = (taskId: UUID) => {

        const newPlanedTask = new TaskAssignmentService().autoAssignTask(
            taskId,
            planedTaskManager,
            taskManager,
            mileStoneManager,
            memberManager,
            scheduleConfiguration,
            ticketManager.getExclusiveTicketIds()
        );

        setPlanedTaskManager(newPlanedTask);
        handleMoveTargetTask(undefined);

    }

    const isSameTaskId = (taskId: UUID) => {
        return taskId === moveTargetTaskId;
    }

    const unassignedTaskBoxes = unassignedTasks.map((task) => {

        const ticketTitle = new NameResolveService().resolveTaskName(task.id, ticketManager, taskManager);

        return (
            <div
                key={task.id}
                style={{ margin: "5px" }}
                onDoubleClick={() => onDoubleClick(task.id)}
                onMouseUp={(e) => onMouseUp(e, task.id)}
            >
                <TaskBeanDiv
                    task={
                        {
                            taskId: task.id,
                            taskName: ticketTitle,
                            taskPhase: task.phase,
                        }
                    }
                    duration={task.duration}
                    moveTargetTaskId={moveTargetTaskId}
                    handleMouseDown={() => onMouseDown(task.id)}
                    handleContextMenu={() => onContextmenu(task.id)}
                />
            </div>

        );
    });


    return (
        <>{unassignedTaskBoxes}</>
    );
}