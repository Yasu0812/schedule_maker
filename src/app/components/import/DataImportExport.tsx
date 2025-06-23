import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";
import { ScheduleCsvConverter } from "@/app/service/ScheduleCsvConverter";
import { Dispatch, SetStateAction, useRef, useState } from "react";

export default function DataImportExport(
    props: {
        schedule: ScheduleStateManager | undefined,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
        hideModal: () => void;
    }
) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

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

    const jsonFileLoad = () => {

        if (!inputRef.current || !inputRef.current.files || inputRef.current.files.length === 0) {
            alert("ファイルが選択されていません。");
            return;
        }

        const file = inputRef.current.files[0];

        const reader = new FileReader();
        props.setSchedule(undefined);
        reader.onload = (event) => {
            try {
                const data = event.target?.result as string;
                const schedule = ScheduleStateJson.fromJson(data);
                props.setSchedule(schedule);
                props.hideModal();

            } catch (error) {
                console.error("Failed to parse JSON:", error);
                alert("JSONの読み込みに失敗しました。正しい形式のファイルを選択してください。");
            }
        };
        reader.readAsText(file);
    }

    const handleClick = () => {
        inputRef.current?.click();

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        } else {
            setFileName(null);
        }
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
        <div className="min-w-lg">
            <h2 className="text-lg font-semibold pb-2 mb-2 border-b">Data Import</h2>
            <div className="flex items-center gap-4">
                <input
                    ref={inputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleChange}
                />

                <button
                    type="button"
                    onClick={handleClick}
                    className="px-4 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700 shadow transition-colors"
                >
                    Open File
                </button>

                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {fileName ?? "No file selected"}
                </span>

                <button
                    className=" bg-green-500 text-white p-2 rounded"
                    onClick={jsonFileLoad}>
                    Load
                </button>


            </div>
            <h2 className="text-lg font-semibold pb-2 mt-6 mb-2 border-b">Data Export</h2>
            <div className="mb-4">
                <button
                    className=" bg-blue-500 text-white p-2 rounded"
                    onClick={jsonFileDownload}>
                    Download
                </button>
            </div>
            <div>
                <button
                    className=" bg-blue-500 text-white p-2 rounded"
                    onClick={csvFileDownload}>
                    CSV Export
                </button>
            </div>

        </div>
    );
}