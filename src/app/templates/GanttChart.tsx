import { AssignedTask } from "@/app/models/AssignedTask";
import { Gantt } from "@/app/models/Gantt";
import { MemberManager } from "@/app/models/MemberManager";
import GanttLine from "../components/gantt/GanttLine";
import { TaskManager } from "@/app/models/TaskManager";
import { DateUtil } from "@/app/common/DateUtil";
import CardDesign from "../components/decorator/CardDesign";


export default function GanttChart(props: {
    assignedTasks: Iterable<AssignedTask>,
    taskManager: TaskManager,
    dayList: Date[],
    memberManager: MemberManager,
}) {

    const {
        dayList,
        assignedTasks,
        taskManager,
        memberManager
    } = props;


    const gantt = Gantt.fromAssignedTasks(assignedTasks);

    return (
        <CardDesign>
            <div style={{ width: '100%' }} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <h2 className="text-lg font-semibold">Schedule Gantt</h2>
                </div>
                <div className="gantt-chart" style={{ overflow: 'scroll' }}>
                    <table className="calendar-box" >
                        <thead>
                            <tr>
                                <th className="calendar-header-item">Task Name</th>
                                <th className="calendar-header-item">Member</th>
                                {
                                    dayList.map((day, index) => (
                                        <th key={index} className="calendar-header-item">
                                            {DateUtil.formatDateShow(day)}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {gantt.getGanttBars().map((bar) => {
                                const task = taskManager.getTask(bar._assignedTask.taskId);
                                if (!task) {
                                    console.warn(`Task with ID ${bar._assignedTask.taskId} not found.`);
                                    return null;
                                }
                                return (
                                    <GanttLine
                                        key={bar.id}
                                        assignedTask={bar._assignedTask}
                                        task={task}
                                        dayList={dayList}
                                        memberManager={memberManager}
                                    />
                                );
                            })}

                        </tbody>
                    </table>
                </div>
            </div>
        </CardDesign>
    );
}