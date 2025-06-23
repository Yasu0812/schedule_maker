import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { Dispatch, SetStateAction, useState } from "react";

export function DataDelete(props: {
    schedule: ScheduleStateManager | undefined,
    setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>,
    hideModal: () => void;
}) {

    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

    return (
        <>
            <h2 className="text-lg font-semibold pb-2 mt-6 mb-2 border-b">Delete Data</h2>
            <div className="mb-4">

                <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    onChange={(e) => {
                        if (e.target.checked) {
                            if (!confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
                                e.target.checked = false;
                                setDeleteConfirm(false);
                            } else {
                                setDeleteConfirm(true);
                            }
                        } else {
                            setDeleteConfirm(false);
                        }
                    }}
                />
                <button
                    className={"bg-red-500 text-white p-2 rounded disabled:opacity-50 transition-opacity" + (deleteConfirm && "cursor-pointer hover:bg-red-600")}
                    disabled={!deleteConfirm}
                    onClick={() => {
                        props.setSchedule(ScheduleStateManager.ScheduleStateManagerFactory());
                        props.hideModal();
                    }}>
                    Delete All Data
                </button>
            </div>
        </>
    );
}