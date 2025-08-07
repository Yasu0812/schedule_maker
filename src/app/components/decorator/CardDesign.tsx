
export default function CardDesign(
    props: {
        popup?: boolean;
        children?: React.ReactNode;
    }
) {

    const { popup = false } = props;

    const popupClass = popup ? "shadow-xl/30 ring-2" : "shadow-lg";

    const className = ` bg-white rounded-xl p-6 space-y-6 font-sans ${popupClass}`;


    return (
        <div className={className}>
            {props.children}
        </div>
    );
}