import { TaskManager } from "@/app/models/TaskManager";
import { JellyBean } from "../decorator/JellyBean";
import { UUID } from "@/app/common/IdUtil";
import { useState, useEffect } from "react";
import { TicketManager } from "@/app/models/Ticket";
import { NameResolveService } from "@/app/service/NameResolveService";

export function GhostJelly(
    props: {
        taskId: UUID | undefined,
        ticketManager: TicketManager,
        taskManager: TaskManager,
    },
) {

    const { taskId, ticketManager, taskManager } = props;

    const task = taskManager.getTask(taskId);

    const [pos, setPos] = useState({ x: 0, y: 0 });

    const tickeTitle = taskId ? new NameResolveService().resolveTaskName(taskId, ticketManager, taskManager) : "";

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            {task &&
                <div style={{
                    position: 'fixed',
                    left: pos.x - 50,
                    top: pos.y - 17,
                    pointerEvents: 'none',
                    userSelect: "none",
                }}>
                    <JellyBean width={75 * task.duration} height={34} phase={task.phase} selected={false}>
                        {tickeTitle}
                    </JellyBean>
                </div>
            }
        </>
    );
}
