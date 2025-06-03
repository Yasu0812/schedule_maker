import { JellyBean } from "../decorator/JellyBean";

export default function PlusButton(props: {
    onClick: () => void;
    isDisabled?: boolean;

}) {

    const disabledStyle = props.isDisabled ? "opacity-50 cursor-not-allowed" : "";


    return (
        <JellyBean width={25} height={25} phase={""} selected={false}>

            <button
                className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" + " " + disabledStyle}
                onClick={props.onClick}
                disabled={props.isDisabled}
            >
                +
            </button>
        </JellyBean>
    );
}