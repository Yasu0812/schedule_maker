"use client";

import { useState, useTransition } from "react";
import { saveScheduleState } from "@/app/actions/scheduleStateActions";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";

const LOCAL_STORAGE_SCHEDULE_KEY = "app-data";
const LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY = "schedule-state-id";

export default function DbSaveButton(props: {
    schedule: ScheduleStateManager;
}) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | undefined>();

    const handleSave = () => {
        setMessage(undefined);

        startTransition(async () => {
            try {
                const scheduleJson = ScheduleStateJson.toJson(props.schedule);
                const scheduleStateId = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY) ?? undefined;
                const saved = await saveScheduleState({
                    id: scheduleStateId,
                    scheduleJson,
                });

                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY, saved.id);
                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, saved.scheduleJson);
                setMessage("DB保存済み");
            } catch (error) {
                console.error("Failed to save schedule data to DB:", error);
                setMessage("DB保存失敗");
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <button
                className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={isPending}
                onClick={handleSave}
                type="button"
            >
                {isPending ? "Saving..." : "DB Save"}
            </button>
            {message && (
                <span className="text-xs text-blue-700">
                    {message}
                </span>
            )}
        </div>
    );
}
