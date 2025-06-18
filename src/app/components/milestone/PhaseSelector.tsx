import { orderedPhases, PhaseEnum, phaseNameShortMap } from "@/app/common/PhaseEnum";
import { JellyBean } from "../decorator/JellyBean";

export default function PhaseSelector(
    props: {
        phases: Set<PhaseEnum>;
        phaseChange: (targetPhase: PhaseEnum) => void;
    }
) {
    const { phases, phaseChange } = props;

    return (
        <div className="flex flex-col flex-wrap gap-1">
            {orderedPhases.map((phase) => (
                <div key={phase} onClick={() => phaseChange(phase)} className="cursor-pointer">
                    <JellyBean

                        width={80}
                        height={30}
                        phase={phase}
                        selected={false}
                        disabled={!phases.has(phase)}
                    >
                        {phaseNameShortMap[phase]}
                    </JellyBean>
                </div>
            ))
            }
        </div >
    );
}