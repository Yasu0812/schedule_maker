import { Task } from "@/app/models/Task";
import { JellyBean } from "../decorator/JellyBean";


export default function GanttModal(props: {
    task: Task,
}) {
    const { task } = props;

    return (
        <div className="h-[50vh] w-[50vw]" >
            <JellyBean width={75} height={35} phase={task.phase} selected={false}>
                {task.ticketTitle}
            </JellyBean>

            <p>Task Name: {task.taskInformation.taskName}</p>
            <p>Task Description:</p>
            <ul>
                {
                    task.taskInformation.description ? (
                        <li><input type="checkbox" />{task.taskInformation.description}</li>
                    ) : (
                        <li>No Description</li>
                    )
                }
            </ul>
            <p>Premise Tasks: </p>
            <ul>
                {task.taskInformation.premiseTaskIds && task.taskInformation.premiseTaskIds.length > 0 ? (
                    task.taskInformation.premiseTaskIds.map((id) => (
                        <li key={id}>{id}</li>
                    ))
                ) : (
                    <li>No Premise Tasks</li>
                )}
            </ul>
        </div>
    );
}