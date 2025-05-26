import { DateUtil } from "@/app/common/DateUtil";
import CalendarCell from "./CalendarCell";
import { CalendarLineTask } from "@/app/models/CalendarCellTask";
import TaskCell from "./TaskCell";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";


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
        return (
            <td key={index} className="calendar-line-item" style={{ position: 'relative', overflow: "hidden", alignItems: "center" }}  >
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
