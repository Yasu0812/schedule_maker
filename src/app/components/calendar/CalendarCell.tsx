import { useState } from "react";


export default function CalendarCell(props: { children: React.ReactNode }) {
    const children = props.children;

    const [showDetail, setShowDetail] = useState<boolean>(false);

    const handleCellClick = () => {
        setShowDetail(!showDetail);
    };


    return (
        <div className={`calendar-cell`} onClick={handleCellClick}>
            {children}
        </div>
    );
}
