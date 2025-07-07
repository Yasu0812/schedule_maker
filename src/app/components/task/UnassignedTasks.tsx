import { Task } from "@/app/models/Task";
import { TaskMergeSplitService } from "@/app/service/TaskMergeSplitService";
import { TaskManager } from "@/app/models/TaskManager";
import { phaseCompare } from "@/app/common/PhaseEnum";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { PlanedTask } from "@/app/models/PlanedTask";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import { UUID } from "@/app/common/IdUtil";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { TicketManager } from "@/app/models/Ticket";
import { NameResolveService } from "@/app/service/NameResolveService";
import { MemberManager } from "@/app/models/MemberManager";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";

export default function UnassignedTasks(
    props: {
        ticketManager: TicketManager,
        unassignedTasks: Task[],
        memberManager: MemberManager,
        taskManager: TaskManager,
        moveTargetTaskId: UUID | undefined,
        planedTaskManager: PlanedTask,
        calandarManager: CalendarCellTaskManager,
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
        calandarManager,
        mileStoneManager,
        planedTaskManager,
        ticketManager,
        scheduleConfiguration,
        setPlanedTaskManager
    } = props;

    const sortedUnassignedTasks = unassignedTasks
        .sort((a, b) => a.duration - b.duration)
        .sort((a, b) => phaseCompare(b.phase, a.phase))
        .sort((a, b) => a.ticketId > b.ticketId ? 1 : -1)
        ;

    const onDoubleClick = (taskId: UUID, clientX: number, currentTarget: HTMLElement) => {
        const rect = currentTarget.getBoundingClientRect();
        const pointX = Math.floor((clientX - rect.left) / 75);
        const newTaskManager = new TaskMergeSplitService().splitTaskLeftDuration(taskId, taskManager, pointX);
        props.setTaskManager(newTaskManager);
        handleMoveTargetTask(undefined);
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
            calandarManager,
            mileStoneManager,
            memberManager,
            scheduleConfiguration,
        );

        setPlanedTaskManager(newPlanedTask);
        handleMoveTargetTask(undefined);

    }

    const isSameTaskId = (taskId: UUID) => {
        return taskId === moveTargetTaskId;
    }

    const unassignedTaskBoxes = sortedUnassignedTasks.map((task) => {

        const ticketTitle = new NameResolveService().resolveTaskName(task.id, ticketManager, taskManager);

        return (
            <div
                key={task.id}
                style={{ margin: "5px" }}
                onDoubleClick={(e) => onDoubleClick(task.id, e.clientX, e.currentTarget)}
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