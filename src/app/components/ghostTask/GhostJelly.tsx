import { TaskManager } from "@/app/models/TaskManager";
import { JellyBean } from "../decorator/JellyBean";
import { UUID } from "@/app/common/IdUtil";
import { useState, useEffect } from "react";

export function GhostJelly(
    props: {
        taskId: UUID,
        taskManager: TaskManager,
    },
) {

    const { taskId, taskManager } = props;

    const task = taskManager.getTask(taskId);

    const [pos, setPos] = useState({ x: 0, y: 0 });

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
                }}>
                    <JellyBean width={100 * task.duration} height={34} phase={task.phase} selected={false}>
                        {task.tickeTitle}
                    </JellyBean>
                </div>
            }
        </>
    );
}
