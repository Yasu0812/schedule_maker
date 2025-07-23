import { orderedPhases, PhaseEnum, phaseNameShortMap } from "@/app/common/PhaseEnum";
import { Dispatch, SetStateAction, } from "react";
import { JellyBean } from "../decorator/JellyBean";
import { FilterOptions } from "@/app/types/FilterOptions";

export default function TaskFilter(props: {
    filterOptions: FilterOptions,
    setFilterOptions: Dispatch<SetStateAction<FilterOptions>>,
}) {

    const { filterOptions, setFilterOptions } = props;

    const handlePhaseClick = (phase: PhaseEnum) => {
        setFilterOptions((prevOptions) => {
            if (prevOptions.phase.length === orderedPhases.length) {
                // If no phases are selected and the first phase is clicked, select it
                return {
                    ...prevOptions,
                    phase: [phase]
                };
            } else if (prevOptions.phase.length === 1 && prevOptions.phase[0] === phase) {
                // If only one phase is selected and it's the clicked phase, deselect it
                return {
                    ...prevOptions,
                    phase: orderedPhases
                };
            } else if (prevOptions.phase.includes(phase)) {
                // If phase is already selected, remove it
                return {
                    ...prevOptions,
                    phase: prevOptions.phase.filter(p => p !== phase)
                };
            }
            // If phase is not selected, add it
            return {
                ...prevOptions,
                phase: [...prevOptions.phase, phase]
            };

        });
    };

    const phases = orderedPhases.map((phase) => {

        const isEnabled = filterOptions.phase.includes(phase);

        return (
            <div key={phase} onClick={() => handlePhaseClick(phase)} className="cursor-pointer">
                <JellyBean width={75} height={30} phase={phase} selected={false} disabled={!isEnabled}>
                    {phaseNameShortMap[phase]}
                </JellyBean>
            </div>
        )
    });

    return (
        <div className="task-filter">
            <input
                type="search"
                placeholder="Filter by title"
                value={filterOptions.title}
                onChange={(e) => setFilterOptions({ ...filterOptions, title: e.target.value })}
                className="border rounded px-2 py-1 mb-2 w-full"
            />
            <div className="flex gap-2 mb-4">
                {phases}
            </div>
        </div>
    );
}