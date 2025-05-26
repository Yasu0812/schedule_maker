import { orderedPhases, PhaseEnum, phaseNameMap } from "@/app/common/PhaseEnum";

interface TicketPhaseInfo {
    phaseId: string;
    duration: number;
    phase: string;
    description: string;
}

export default function TicketDetail(props: {
    ticketPhases: Map<PhaseEnum, TicketPhaseInfo>;
}) {


    const phases = orderedPhases.map((phase) => {
        const phaseInfo = props.ticketPhases.get(phase);
        if (!phaseInfo) {
            return undefined;
        }
        return (
            <div key={phase}>
                <h3>{phaseNameMap[phase]}</h3>
                <p>工数: {phaseInfo.duration} 日</p>
                <p>備考: {phaseInfo.description}</p>
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