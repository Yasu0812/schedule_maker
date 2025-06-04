
export function JellyBean(
    props: {
        width: number,
        height: number,
        phase: string,
        selected: boolean,
        children: React.ReactNode
    },
) {

    const { width, height, phase, children } = props;

    const selected = props.selected ? "selected" : "";


    const className = `jellybean calendar-cell-${phase} ${selected}`;

    return (
        <div style={{ position: "relative" }}>
            <div
                style={{
                    width,
                    height,
                    borderRadius: `${height / 4}px / ${height / 4}px`,
                    alignItems: "center",
                    justifyContent: "center",
                    animationFillMode: "forwards",

                }}
                className={className}
            >
                {children}

            </div >
            <div className="jellybean-gloss" />
        </div>
    );
}
