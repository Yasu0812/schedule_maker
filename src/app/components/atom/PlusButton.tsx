import { JellyBean } from "../decorator/JellyBean";

export default function PlusButton(props: {
    onClick: () => void;
}) {
    return (
        <JellyBean width={30} height={30} phase={""} selected={false}>

            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={props.onClick}
            >
                +
            </button>
        </JellyBean>
    );
}