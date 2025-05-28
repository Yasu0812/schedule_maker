
export default function CardDesign(
    props: {
        children: React.ReactNode;
    }
) {
    return (
        <div className="mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6 font-sans">
            {props.children}
        </div>
    );
}