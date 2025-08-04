import { AssignedTask } from "@/app/models/AssignedTask";
import { MemberManager } from "@/app/models/MemberManager";
import { Task } from "@/app/models/Task";
import { DateUtil } from "@/app/common/DateUtil";
import TaskBeanDiv from "../atom/TaskBeanDiv";


export default function GanttLine(props: {
    assignedTask: AssignedTask,
    task: Task,
    dayList: Date[],
    memberManager: MemberManager,
}) {

    const {
        assignedTask,
        task,
        dayList,
        memberManager
    } = props;


    return (
        <tr>
            <th scope="row" className="calendar-cell-header border-2">
                {task.taskInformation.taskName || ""}
            </th>
            <th scope="row" className="calendar-cell-header border-2">
                {memberManager.getMember(assignedTask.memberId)?.name || "Unknown Member"}
            </th>
            {
                dayList.map((day, index) => {
                    const isTaskDay = DateUtil.isSameDay(assignedTask.startDay, day);
                    if (!isTaskDay) {
                        return <td key={index} className="calendar-cell"></td>;
                    }

                    return (
                        <td key={index} className={`calendar-cell calendar-task-cell`}>
                            <div style={{ overflow: 'visible' }}>
                                <TaskBeanDiv
                                    task={{
                                        taskId: task.id,
                                        taskName: task.ticketTitle,
                                        taskPhase: task.phase,
                                    }}
                                    duration={task.duration}
                                    moveTargetTaskId={undefined}
                                />
                            </div>
                        </td>
                    );
                })
            }
        </tr>
    );
}