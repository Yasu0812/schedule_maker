import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { Dispatch, SetStateAction } from "react";
import { DataExport } from "./DataExport";
import { DataDelete } from "./DataDelete";
import { ProjectImport } from "./ProjectImport";
import { TicketImport } from "./TicketImport";

export default function DataImportExport(
    props: {
        schedule: ScheduleStateManager | undefined,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
        hideModal: () => void;
    }
) {

    return (
        <div className="min-w-lg">
            <h2 className="text-lg font-semibold pb-2 mb-2 border-b">Data Import</h2>
            <ProjectImport schedule={props.schedule} setSchedule={props.setSchedule} hideModal={props.hideModal} />
            <TicketImport schedule={props.schedule} setSchedule={props.setSchedule} hideModal={props.hideModal} />

            <DataExport schedule={props.schedule} setSchedule={props.setSchedule} />
            <DataDelete schedule={props.schedule} setSchedule={props.setSchedule} hideModal={props.hideModal} />

        </div>
    );
}