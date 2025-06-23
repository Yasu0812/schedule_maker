import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";
import { ScheduleCsvConverter } from "@/app/service/ScheduleCsvConverter";
import { Dispatch, SetStateAction } from "react";

export function DataExport(props: {
    schedule: ScheduleStateManager | undefined,
    setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
}) {


    const jsonFileDownload = () => {
        const schedule = props.schedule;
        if (!schedule) return;
        const data = ScheduleStateJson.toJson(schedule);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedule.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const csvFileDownload = () => {
        const schedule = props.schedule;
        if (!schedule) return;
        const csvContent = new ScheduleCsvConverter().toCsv(schedule);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'schedule.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    return (
        <>
            <h2 className="text-lg font-semibold pb-2 mt-6 mb-2 border-b">Data Export</h2>
            <div className="mb-4">
                <button
                    className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                    onClick={jsonFileDownload}>
                    Download
                </button>
            </div>
            <div>
                <button
                    className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                    onClick={csvFileDownload}>
                    CSV Export
                </button>
            </div>
        </>
    );
}