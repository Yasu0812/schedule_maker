import { AssignedTask } from "@/app/models/AssignedTask";
import { MemberManager } from "@/app/models/MemberManager";
import { Task } from "@/app/models/Task";
import { DateUtil } from "@/app/common/DateUtil";
import TaskBeanDiv from "../atom/TaskBeanDiv";
import { useModal } from "../modal/ModalContext";
import GanttModal from "./GanttModal";


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

    const { showModal } = useModal();

    const handleTaskClick = () => {
        showModal(() => {
            return <GanttModal
                task={task}
            />;
        });
    };

    return (
        <tr>
            <th scope="row" className="calendar-cell-header border-2">
                {task.ticketTitle || "No Task Name"}
            </th>
            <th scope="row" className="calendar-cell-header border-2">
                {task.taskInformation.taskName || "No Task Name"}
            </th>
            <th scope="row" className="calendar-cell-header border-2">
                {memberManager.getMember(assignedTask.memberId)?.name || "Unknown Member"}
            </th>
            <th className="calendar-cell border-2">
                {DateUtil.formatDateShow(assignedTask.startDay)}
            </th>
            <th className="calendar-cell border-2">
                {DateUtil.formatDateShow(assignedTask.endDay)}
            </th>
            {
                dayList.map((day, index) => {
                    const isTaskDay = DateUtil.isSameDay(assignedTask.startDay, day);
                    if (!isTaskDay) {
                        return <td key={index} className="calendar-cell calendar-line-item"></td>;
                    }

                    return (
                        <td key={index} className={`calendar-cell calendar-task-cell`}>
                            <div style={{ overflow: 'visible' }} onClick={handleTaskClick}>
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