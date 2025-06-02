import { JellyBean } from "../decorator/JellyBean";

export default function MinusButton(props: {
    onClick: () => void;
}) {
    return (
        <JellyBean width={30} height={30} phase={""} selected={false}>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={props.onClick}
            >
                -
            </button>
        </JellyBean>
    );
}