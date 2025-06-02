import { orderedPhases, PhaseEnum, phaseNameMap } from "@/app/common/PhaseEnum";
import MinusButton from "../atom/MinusButton";
import PlusButton from "../atom/PlusButton";

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
            <div key={phase}>
                <h3 className="flex mb-2">{phaseNameMap[phase]}</h3>
                <div className="flex mb-2 px-2"><MinusButton onClick={() => props.pushMinus(phase)} />{phaseInfo?.duration || 0} 日<PlusButton onClick={() => props.pushPlus(phase)} /></div>
            </div>
        );
    }
    );

    return (
        <div>
            {phases}
        </div>
    );
}