import { PhaseEnum } from "@/app/common/PhaseEnum";
import MinusButton from "../atom/MinusButton";
import PlusButton from "../atom/PlusButton";
import { useState } from "react";

export default function PhaseDurationInput(props: {

    phase: PhaseEnum;
    duration: number;
    incrementHandler: () => void;
    decrementHandler: () => void;
}) {

    const { duration } = props;

    const [value, setValue] = useState<number | undefined>(duration);

    const isMinusDisabled = duration <= 0;

    const isPlusDisabled = duration >= 255;

    const incrementHandler = () => {
        if (!value || value < 255) {
            setValue((prev) => Number(prev) + 1);
            props.incrementHandler();
        }
    }

    const decrementHandler = () => {
        if (!value || value > 0) {
            setValue((prev) => Number(prev) - 1);
            props.decrementHandler();
        }
    }

    const submitValue = (newValue: number) => {
        if (newValue !== undefined && newValue >= 0 && newValue <= 255) {
            let subValue = duration - newValue;
            if (subValue !== 0) {
                if (subValue > 0) {
                    while (subValue > 0) {
                        props.decrementHandler();
                        subValue--;
                    }
                } else {
                    while (subValue < 0) {
                        props.incrementHandler();
                        subValue++;
                    }
                }
            }
        }
    }

    return (
        <div className="flex mb-2 px-2 items-center">
            <div className="w-15 pe-1">
                <input
                    type="number"
                    min={0}
                    max={255}
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-400"
                    value={value ?? ''}
                    onChange={(e) => {
                        const newValue = parseInt(e.currentTarget.value, 10);
                        if (isNaN(newValue)) {
                            setValue(undefined);
                            return;
                        }
                        if (newValue >= 0 && newValue <= 255) {
                            setValue(newValue);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const newValue = parseInt(e.currentTarget.value, 10);
                            submitValue(newValue);
                        }
                    }}
                    onBlur={(e) => {
                        const newValue = parseInt(e.currentTarget.value, 10);
                        submitValue(newValue);
                    }}
                    readOnly
                />
            </div>
            <div className="pe-1"><MinusButton onClick={decrementHandler} isDisabled={isMinusDisabled} /></div>
            <div className="pe-1"><PlusButton onClick={incrementHandler} isDisabled={isPlusDisabled} /></div>
        </div>
    );
}