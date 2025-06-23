'use client'
import { useEffect, useState } from "react";
import Header from "./components/atom/Header";
import { ScheduleStateManager } from "./models/ScheduleStateManager";
import ScheduleMaker from "./templates/ScheduleMaker";
import { ScheduleStateJson } from "./models/serialize/ScheduleStateJson";
import { ModalProvider } from "./components/modal/ModalContext";

export default function Home() {

    const [schdule, setSchedule] = useState<ScheduleStateManager>();

    useEffect(() => {
        const data = localStorage.getItem('app-data');
        if (data) {
            try {
                setSchedule(ScheduleStateJson.fromJson(data))
            } catch (error) {
                console.error("Failed to load schedule data from localStorage:", error);
                // Fallback to default schedule if loading fails
                setSchedule(ScheduleStateManager.ScheduleStateManagerFactory());
            }

        } else {
            // If no data in localStorage, initialize with default schedule
            setSchedule(ScheduleStateManager.ScheduleStateManagerFactory());
        }
    }, []);


    useEffect(() => {
        if (!schdule) return;
        localStorage.setItem('app-data', ScheduleStateJson.toJson(schdule));
    }, [schdule]);

    return (
        <>
            <ModalProvider>
                {schdule &&
                    <><Header
                        schdule={schdule}
                        setSchedule={setSchedule}
                    />
                        <ScheduleMaker
                            schdule={schdule}
                            setSchedule={setSchedule}
                        />
                    </>
                }
                {!schdule &&
                    <div className="flex justify-center items-center h-screen">
                        <div className="text-2xl">Loading... </div>
                        <div className="animate-spin h-5 w-5 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                }
            </ModalProvider>
        </>
    );
}
