import { orderedPhases, phaseNameMap } from "@/app/common/PhaseEnum";
import { JellyBean } from "../decorator/JellyBean";

export default function Legend() {

    const legends = orderedPhases.map((phase) => {
        return (
            <JellyBean key={phase}
                width={200}
                height={34}
                phase={phase}
                selected={false}
            >
                {phaseNameMap[phase]}
            </JellyBean>
        );
    });


    return (
        <div className="legend">
            {legends}
        </div>
    );
}