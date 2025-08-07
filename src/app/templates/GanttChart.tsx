import { AssignedTask } from "@/app/models/AssignedTask";
import { Gantt } from "@/app/models/Gantt";
import { MemberManager } from "@/app/models/MemberManager";
import GanttLine from "../components/gantt/GanttLine";
import { TaskManager } from "@/app/models/TaskManager";
import { DateUtil } from "@/app/common/DateUtil";
import CardDesign from "../components/decorator/CardDesign";
import { useState } from "react";


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
    const [scale, setScale] = useState(1);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

    return (
        <CardDesign>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b pb-2">
                    <h2 className="text-lg font-semibold">Schedule Gantt</h2>
                    <div className="flex items-center gap-2">
                        <button onClick={zoomIn} disabled={scale === 2} className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50">+</button>
                        <button onClick={zoomOut} disabled={scale === 0.5} className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50">-</button>
                        <span className="text-sm">Scale: {scale.toFixed(1)}</span>
                    </div>
                </div>
                <div className="gantt-chart h-[75vh]" style={{ overflow: 'scroll' }}>
                    <table className="calendar-box w-full h-full" style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
                        <thead className="">
                            <tr>
                                <th className="calendar-header-item">Task Name</th>
                                <th className="calendar-header-item">Member</th>
                                <th className="calendar-header-item">Start Day</th>
                                <th className="calendar-header-item">End Day</th>
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