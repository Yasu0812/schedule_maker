import { PhaseEnum } from "@/app/common/PhaseEnum";
import MinusButton from "../atom/MinusButton";
import PlusButton from "../atom/PlusButton";

export default function PhaseDurationInput(props: {

    phase: PhaseEnum;
    duration: number;
    incrementHandler: () => void;
    decrementHandler: () => void;
}) {

    const { duration, incrementHandler, decrementHandler } = props;

    const isMinusDisabled = (): boolean => {
        if (duration <= 0) return true;
        return false;
    }

    const isPlusDisabled = (): boolean => {
        if (duration >= 255) return true;
        return false;
    }

    return (
        <div className="flex mb-2 px-2 items-center">
            <div className="w-15 pe-1">
                <input
                    type="number"
                    min={0}
                    max={255}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-400"
                    value={duration}
                    readOnly
                />
            </div>
            <div className="pe-1"><MinusButton onClick={decrementHandler} isDisabled={isMinusDisabled()} /></div>
            <div className="pe-1"><PlusButton onClick={incrementHandler} isDisabled={isPlusDisabled()} /></div>
        </div>
    );
}