import { DateUtil } from "@/app/common/DateUtil";
import CalendarCell from "./CalendarCell";
import { CalendarLineTask } from "@/app/models/CalendarCellTask";
import TaskCell from "./TaskCell";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import DayColor from "../decorator/DayColor";


export default function CalendarLine(
    props: {
        rowIndex: number,
        dayListItems: Date[],
        member: string| undefined,
        memberId: UUID,
        lineTask: CalendarLineTask,
        taskManager: TaskManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
    }
) {
    const dayList = props.dayListItems;
    const lineTask = props.lineTask;
    const member = props.member;
    const memberId = props.memberId;
    const taskManager = props.taskManager;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const planedTaskManager = props.planedTaskManager;
    const moveTargetTaskId = props.moveTargetTaskId;
    const setPlanedTaskManager = props.setPlanedTaskManager;

    const dayListItems = dayList.map((day, index) => {
        const dayString = DateUtil.formatDate(day);
        const isHoliday = DateUtil.isHoliday(day);
        const task = lineTask.getTaskForDate(dayString);

        return (
            <td key={index} className="calendar-line-item" style={{ position: 'relative', alignItems: "center" }} >
                <DayColor dayString={dayString}>
                    <CalendarCell>
                        {!isHoliday && <TaskCell
                            task={task}
                            taskManager={taskManager}
                            planedTaskManager={planedTaskManager}
                            setPlanedTaskManager={setPlanedTaskManager}
                            moveTargetTaskId={moveTargetTaskId}
                            handleMoveTargetTask={handleMoveTargetTask}
                            memberId={memberId}
                            startDay={day}
                        />}
                    </CalendarCell>
                </DayColor>
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
