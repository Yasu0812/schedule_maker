import { orderedPhases, PhaseEnum, phaseNameMap } from "@/app/common/PhaseEnum";
import { JellyBean } from "../decorator/JellyBean";
import PhaseDurationInput from "./PhaseDurationInput";

interface TicketPhaseInfo {
    phaseId: string;
    duration: number;
    phase: string;
    description: string;
}

export default function TicketDetail(props: {
    ticketPhases: Map<PhaseEnum, TicketPhaseInfo>;
    pushPlus: (phase: PhaseEnum) => void;
    pushMinus: (phase: PhaseEnum) => void;
}) {

    const phases = orderedPhases.map((phase) => {
        const phaseInfo = props.ticketPhases.get(phase);
        return (
            <div key={phase} className="mb-4 flex">
                <div className="flex mb-2"><JellyBean phase={phase} width={250} height={30} selected={false}>{phaseNameMap[phase]}</JellyBean></div>
                <div className="flex mb-2 px-2 items-center">
                    <PhaseDurationInput
                        phase={phase}
                        duration={phaseInfo ? phaseInfo.duration : 0}
                        incrementHandler={() => props.pushPlus(phase)}
                        decrementHandler={() => props.pushMinus(phase)}
                    />
                </div>
            </div >
        );
    }
    );

    return (
        <div>
            {phases}
        </div>
    );
}