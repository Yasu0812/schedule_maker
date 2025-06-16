'use client'
import { useEffect, useState } from "react";
import Header from "./components/atom/Header";
import { ScheduleStateManager } from "./models/ScheduleStateManager";
import SceduleMaker from "./templates/SceduleMaker";
import { ScheduleStateJson } from "./models/serialize/ScheduleStateJson";

export default function Home() {

    const [schdule, setSchedule] = useState<ScheduleStateManager>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const data = localStorage.getItem('app-data');
        if (data) {
            try {
                setSchedule(ScheduleStateJson.fromJson(data))
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load schedule data from localStorage:", error);
                // Fallback to default schedule if loading fails
                setSchedule(ScheduleStateManager.ScheduleStateManagerFactory(new Date("2025-04-01T00:00:00Z"), new Date("2025-06-30T00:00:00Z")));
                setIsLoading(false);
            }

        } else {
            // If no data in localStorage, initialize with default schedule
            setSchedule(ScheduleStateManager.ScheduleStateManagerFactory(new Date("2025-04-01T00:00:00Z"), new Date("2025-06-30T00:00:00Z")));
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        if (!schdule) return;
        localStorage.setItem('app-data', ScheduleStateJson.toJson(schdule));
    }, [schdule]);

    return (
        <>
            <Header />
            {!isLoading && schdule && <SceduleMaker
                schdule={schdule}
                setSchedule={setSchedule}
            />}
            {isLoading &&
                <div className="flex justify-center items-center h-screen">
                    <div className="text-2xl">Loading... </div>
                    <div className="animate-spin h-5 w-5 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            }
        </>
    );
}
