import { MileStoneManager } from "@/app/models/MileStoneManager";
import MileStoneIcon from "../atom/MileStoneIcon";


export function MileStoneLine(props: {
    mileStoneManager: MileStoneManager
    dayListItems: Date[]
}) {

    const { mileStoneManager, dayListItems } = props;


    return (
        <tr>
            <th>
                <div className="text-left font-semibold">Milestones</div>
            </th>
            {dayListItems.map((day, index) => {
                const mileStones = mileStoneManager.getMileStoneByDay(day);
                return (
                    <td key={index} className="p-2 items-center">
                        <div className="flex items-center">
                            {mileStones.map((mileStone) => (
                                <span key={mileStone.id} className="">
                                    <MileStoneIcon
                                        color={"#ee6b3f"}
                                    />
                                </span>
                            ))}
                        </div>
                    </td>
                );
            })}
        </tr>
    );
}