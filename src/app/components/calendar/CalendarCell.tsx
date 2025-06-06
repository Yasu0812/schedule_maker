

export default function CalendarCell(props: { children: React.ReactNode }) {
    const children = props.children;

    return (
        <div className={`calendar-cell`}>
            {children}
        </div>
    );
}
