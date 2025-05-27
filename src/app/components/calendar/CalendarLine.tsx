import { DateUtil } from "@/app/common/DateUtil";
import CalendarCell from "./CalendarCell";
import { CalendarLineTask } from "@/app/models/CalendarCellTask";
import TaskCell from "./TaskCell";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import { DraggableDiv } from "../atom/DraggableDiv";
import { JellyBean } from "../decorator/JellyBean";


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

    const dayListItems = dayList.map((day, index) => {
        const dayString = DateUtil.formatDate(day);
        const task = lineTask.getTaskForDate(dayString);
        const planedTask = planedTaskManager.get(task?.taskId);
        return (
            <td key={index} className="calendar-line-item" style={{ position: 'relative', overflow: "", alignItems: "center" }} >
                {task && planedTask?.startDayNum === index &&
                    <div onMouseDown={() => { handleMoveTargetTask(task?.taskId) }} style={{ position: "absolute", top: 0, left: 0, width: 100 * planedTask?.duration, height: "100%", zIndex: 1 }} >
                        <JellyBean width={100 * planedTask?.duration} height={36} phase={task?.taskPhase} selected={moveTargetTaskId === task?.taskId} >
                            &nbsp;{task?.taskName}
                        </JellyBean>
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
