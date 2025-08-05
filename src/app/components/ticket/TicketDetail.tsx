import { orderedPhases, PhaseEnum, phaseNameMap, } from "@/app/common/PhaseEnum";
import { JellyBean } from "../decorator/JellyBean";
import PhaseDurationInput from "./PhaseDurationInput";
import { useState } from "react";

interface TicketPhaseInfo {
    phaseId: string;
    duration: number;
    phase: string;
    description: string;
}

export default function TicketDetail(props: {
    ticketPhases: Map<PhaseEnum, TicketPhaseInfo>;
    changeDuration: (phase: PhaseEnum, duration: number) => number;
    parseInput: (input: string) => void;
}) {

    const { ticketPhases, changeDuration, parseInput } = props;

    const [inputValues, setInputValues] = useState<string>("");

    const phases = orderedPhases.map((phase) => {
        const phaseInfo = ticketPhases.get(phase);
        return (
            <div key={phase} className="mb-2 flex">
                <div className="flex"><JellyBean phase={phase} width={250} height={30} selected={false}>{phaseNameMap[phase]}</JellyBean></div>
                <div className="flex px-2 items-center">
                    <PhaseDurationInput
                        phase={phase}
                        duration={phaseInfo ? phaseInfo.duration : 0}
                        changeDuration={changeDuration}
                    />
                </div>
            </div >
        );
    }
    );

    return (
        <div>
            {phases}
            <textarea className="w-full p-2 border border-gray-300 rounded" value={inputValues} placeholder="Add a description..." onChange={(e) => setInputValues(e.target.value)}></textarea>
            <div className="mt-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => {
                        parseInput(inputValues);
                        setInputValues("");
                    }}
                >
                    Save Description
                </button>
            </div>
        </div>
    );
}