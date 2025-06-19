import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";
import { Dispatch, SetStateAction } from "react";

export default function DataImportExport(
    props: {
        schedule: ScheduleStateManager | undefined,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
        hideModal: () => void;
    }
) {


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


    return (
        <div className="w-full h-full flex justify-center items-center gap-4">
            <form className="mt-4">
                <input type="file" accept=".json" className="border p-2 rounded
                " onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                try {
                                    const data = event.target?.result as string;
                                    const schedule = ScheduleStateJson.fromJson(data);
                                    props.setSchedule(schedule);
                                } catch (error) {
                                    console.error("Failed to parse JSON:", error);
                                } finally {
                                    props.hideModal();
                                }
                            };
                            reader.readAsText(file);
                        }
                    }} />
            </form>
            <button
                className="mt-4 bg-blue-500 text-white p-2 rounded"
                onClick={jsonFileDownload}>
                Download
            </button>
        </div>
    );
}