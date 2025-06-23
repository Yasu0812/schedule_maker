import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { CsvToTicketService } from "@/app/service/CsvToTicketService";
import { useRef, useState } from "react";


export function TicketImport(props: {
    schedule: ScheduleStateManager | undefined,
    setSchedule: (schedule: ScheduleStateManager | undefined) => void,
    hideModal: () => void;
}) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const csvFileLoad = () => {

        if (!inputRef.current || !inputRef.current.files || inputRef.current.files.length === 0) {
            alert("ファイルが選択されていません。");
            return;
        }


        const file = inputRef.current.files[0];

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (!props.schedule) {
                    alert("スケジュールが設定されていません。");
                    return;
                }
                const data = event.target?.result as string;
                const schedule = new CsvToTicketService().updateFromCsv(data, props.schedule);
                props.setSchedule(schedule);
                props.hideModal();

            } catch (error) {
                console.error("Failed to parse csv:", error);
                alert("csvの読み込みに失敗しました。正しい形式のファイルを選択してください。");
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

    return (
        <>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Ticket</h3>
            <div className="flex items-center gap-4 mb-4">
                <input
                    ref={inputRef}
                    type="file"
                    accept=".csv"
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
                    onClick={csvFileLoad}>
                    Load
                </button>
            </div>
        </>
    );
}