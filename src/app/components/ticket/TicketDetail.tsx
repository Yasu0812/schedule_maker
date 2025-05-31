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
                <h3>{phaseNameMap[phase]}</h3>
                <p>工数: {phaseInfo?.duration || 0} 日</p><p><PlusButton onClick={() => props.pushPlus(phase)} />&nbsp;<MinusButton onClick={() => props.pushMinus(phase)} /></p>
                <p>備考: {phaseInfo?.description}</p>
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