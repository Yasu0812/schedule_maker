import { DateUtil } from "@/app/common/DateUtil";
import CalendarCell from "./CalendarCell";
import { CalendarLineTask } from "@/app/models/CalendarCellTask";
import TaskCell from "./TaskCell";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { TaskAssignmentService } from "@/app/service/TaskAssignmentService";
import { PlanningStatusService } from "@/app/service/PlanningStatusService";
import { parsePhase } from "@/app/common/PhaseEnum";


export default function CalendarLine(
    props: {
        rowIndex: number,
        dayListItems: Date[],
        member: string,
        lineTask: CalendarLineTask,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {
    const rowIndex = props.rowIndex;
    const dayList = props.dayListItems;
    const lineTask = props.lineTask;
    const member = props.member;
    const taskManager = props.taskManager;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const planedTaskManager = props.planedTaskManager;
    const moveTargetTaskId = props.moveTargetTaskId;
    const setPlanedTaskManager = props.setPlanedTaskManager;

    const disAssignTask = (taskId: UUID) => {
        const assignedTaskId = planedTaskManager.get(taskId);
        if (assignedTaskId) {
            // すでに割り当てられているタスクを解除する
            const newPlanedTask = new TaskAssignmentService().disassignTask(
                assignedTaskId.id,
                planedTaskManager,
            );
            setPlanedTaskManager(
                newPlanedTask
            );
        }
    }


    const dayListItems = dayList.map((day, index) => {
        const dayString = DateUtil.formatDate(day);
        const task = lineTask.getTaskForDate(dayString);
        const planedTask = planedTaskManager.get(task?.taskId);

        const isFinishedBeforePhase = (planedTask && task && new PlanningStatusService().isFinishedBeforePhaseWithDay(
            planedTask?.ticketId,
            parsePhase(task.taskPhase),
            taskManager,
            planedTaskManager,
            index

        )) ? true : false;

        return (
            <td key={index} className="calendar-line-item" style={{ position: 'relative', alignItems: "center" }} >
                {task && planedTask?.startDayNum === index &&
                    <div style={{ position: "absolute", top: 0, left: 0, }}>
                        <TaskBeanDiv
                            task={task}
                            duration={planedTask.duration}
                            moveTargetTaskId={moveTargetTaskId}
                            handleMouseDown={() => handleMoveTargetTask(task.taskId)}
                            handleContextMenu={() => disAssignTask(task.taskId)}
                            isFinishedBeforePhase={!isFinishedBeforePhase}
                        />
                    </div>
                }
                <CalendarCell>
                    <TaskCell
                        rowIndex={rowIndex}
                        colIndex={index}
                        task={task}
                        taskManager={taskManager}
                        planedTaskManager={planedTaskManager}
                        setPlanedTaskManager={setPlanedTaskManager}
                        moveTargetTaskId={moveTargetTaskId}
                        handleMoveTargetTask={handleMoveTargetTask}
                        member={member}
                    />
                </CalendarCell>
            </td >
        );
    });

    return (
        <tr>
            <th scope="row" className="calendar-line-item">
                <CalendarCell >
                    {member}
                </CalendarCell>
            </th>
            {dayListItems}
        </tr>
    );
}
