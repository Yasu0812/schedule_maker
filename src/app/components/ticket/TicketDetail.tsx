import { orderedPhases, PhaseEnum, phaseNameMap, } from "@/app/common/PhaseEnum";
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
    changeDuration: (phase: PhaseEnum, duration: number) => void;
}) {

    const { ticketPhases, changeDuration } = props;

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
        </div>
    );
}