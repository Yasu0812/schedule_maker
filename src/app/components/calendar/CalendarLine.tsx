import { DateUtil } from "@/app/common/DateUtil";
import CalendarCell from "./CalendarCell";
import { CalendarLineTask } from "@/app/models/CalendarCellTask";
import TaskCell from "./TaskCell";
import { UUID } from "@/app/common/IdUtil";
import { PlanedTask } from "@/app/models/PlanedTask";
import { TaskManager } from "@/app/models/TaskManager";
import DayColor from "../decorator/DayColor";
import { MemberManager } from "@/app/models/MemberManager";
import { MemberService } from "@/app/service/MemberService";


export default function CalendarLine(
    props: {
        dayListItems: Date[],
        member: string | undefined,
        memberId: UUID,
        lineTask: CalendarLineTask,
        taskManager: TaskManager,
        memberManager: MemberManager,
        planedTaskManager: PlanedTask,
        setPlanedTaskManager: (planedTaskManager: PlanedTask) => void,
        setMemberManager: (memberManager: MemberManager) => void,
        moveTargetTaskId: UUID | undefined,
        handleMoveTargetTask: (taskId: UUID | undefined) => void,
        isEditing: boolean,
        handleEditMember: (memberId: UUID | undefined) => void,
    }
) {
    const dayList = props.dayListItems;
    const lineTask = props.lineTask;
    const member = props.member;
    const memberId = props.memberId;
    const taskManager = props.taskManager;
    const memberManager = props.memberManager;
    const handleMoveTargetTask = props.handleMoveTargetTask;
    const planedTaskManager = props.planedTaskManager;
    const moveTargetTaskId = props.moveTargetTaskId;
    const setPlanedTaskManager = props.setPlanedTaskManager;
    const setMemberManager = props.setMemberManager;

    const hasAssignTask = lineTask.hasTask();

    const isEditing = props.isEditing;

    const memberDeleteHandler = () => {
        const {
            memberManager: newMemberManager,
            planedTask: newPlanedTask
        } = new MemberService().removeMember(
            memberId,
            memberManager,
            planedTaskManager,
        )
        setPlanedTaskManager(newPlanedTask);
        setMemberManager(newMemberManager);
    }

    const memberNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMemberName = e.target.value.trim();
        if (newMemberName) {
            const newMemberManager = new MemberService().updateMemberName(
                memberId,
                newMemberName,
                memberManager
            );
            setMemberManager(newMemberManager);
        }
    };

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
            </td>
        );
    });

    const memberArea = (() => {



        if (isEditing) {
            return (
                <input
                    type="text"
                    value={member}
                    onChange={(e) => { memberNameChangeHandler(e) }}
                    onBlur={() => props.handleEditMember(undefined)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            props.handleEditMember(undefined);
                        }
                    }}
                    className="text-gray-700"
                />
            );
        } else {
            return (
                <span className="text-gray-700" onDoubleClick={() => props.handleEditMember(memberId)}>
                    {member}
                </span>
            );
        }

    })();

    return (
        <tr>
            <th scope="row" className="calendar-line-item">
                <CalendarCell >
                    <div style={{ alignItems: 'left' }}>
                        {
                            !hasAssignTask && !isEditing && <button
                                className="text-red-500 hover:text-red-700"
                                onClick={memberDeleteHandler}
                            >
                                x
                            </button>
                        }
                        {memberArea}
                    </div>

                </CalendarCell>
            </th>
            {dayListItems}
        </tr>
    );
}
