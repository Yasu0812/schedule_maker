import { orderedPhases, PhaseEnum, phaseNameMap } from "@/app/common/PhaseEnum";
import MinusButton from "../atom/MinusButton";
import PlusButton from "../atom/PlusButton";
import { JellyBean } from "../decorator/JellyBean";

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

    const isDisabled = (phase: PhaseEnum): boolean => {
        const phaseInfo = props.ticketPhases.get(phase);
        if (!phaseInfo) return true;
        return phaseInfo.duration <= 0;
    }


    const phases = orderedPhases.map((phase) => {
        const phaseInfo = props.ticketPhases.get(phase);
        return (
            <div key={phase} className="mb-4">
                <div className="flex mb-2"><JellyBean phase={phase} width={300} height={30} selected={false}>{phaseNameMap[phase]} <div className="ps-1">({phaseInfo?.duration || 0} days)</div></JellyBean></div>
                <div className="flex mb-2 px-2 items-center">
                    <div className="pe-1"><MinusButton onClick={() => props.pushMinus(phase)} isDisabled={isDisabled(phase)} /></div>
                    <div className="pe-1"><PlusButton onClick={() => props.pushPlus(phase)} /></div>
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