
export default function MinusButton(props: {
    onClick: () => void;
}) {
    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={props.onClick}
        >
            -
        </button>
    );
}