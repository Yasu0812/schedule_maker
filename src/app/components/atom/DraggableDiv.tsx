import { useState } from "react";

export function DraggableDiv(props: {
    width: number,
    height: number,
    children: React.ReactNode,
}) {

    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const draggclass = dragging ? "drag" : "";
    const className = `${draggclass}`;

    const onDragStart = (e: React.MouseEvent) => {
        setDragging(true);
        setPosition({ x: e.clientX, y: e.clientY });
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const draggingStyle = dragging
        ? {
            left: position.x - 40,
            top: position.y - 10,
        }
        : {};

    return (
        <>
            <div
                style={{
                    position: dragging ? "fixed" : "relative",
                    display: "inline-flex",
                    width: props.width,
                    height: props.height,
                    pointerEvents: dragging ? "none" : "auto",
                    ...draggingStyle,
                }}
                className={className}
                draggable={true}
                onDragStart={onDragStart}
            >
                {props.children}
            </div>
            <style jsx>
                {`
                    .drag{
                        zIndex: 1000,
                        cursor: "grab",
                        userSelect: "none",
                    }
                `}
            </style>
        </>
    );
}