'use client'
import { useEffect, useState } from "react";
import Header from "./components/atom/Header";
import { ScheduleStateManager } from "./models/ScheduleStateManager";
import ScheduleMaker from "./templates/ScheduleMaker";
import { ScheduleStateJson } from "./models/serialize/ScheduleStateJson";
import { ModalProvider } from "./components/modal/ModalContext";
import GanttChart from "./templates/GanttChart";
import { PageContents } from "./types/PageContents";

export default function Home() {

    const [schedule, setSchedule] = useState<ScheduleStateManager>();

    const [showContent, setShowContent] = useState(PageContents.SCHEDULE_MAKER);

    const handleShowContent = (content: PageContents) => {
        setShowContent(content);
    };

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
        if (!schedule) return;
        localStorage.setItem('app-data', ScheduleStateJson.toJson(schedule));
    }, [schedule]);

    return (
        <>
            <ModalProvider>
                {schedule &&
                    <>
                        <Header
                            schedule={schedule}
                            setSchedule={setSchedule}
                            handleShowContent={handleShowContent}
                        />
                        {
                            showContent === PageContents.SCHEDULE_MAKER && (
                                <ScheduleMaker
                                    schedule={schedule}
                                    setSchedule={setSchedule}
                                />
                            )
                        }
                        {
                            showContent === PageContents.GANTT_CHART && (
                                <GanttChart
                                    assignedTasks={schedule.planedTaskManager.getAll()}
                                    taskManager={schedule.taskManager}
                                    dayList={schedule.scheduleConfiguration.dayList}
                                    memberManager={schedule.memberManager}
                                />
                            )
                        }
                    </>
                }
                {!schedule &&
                    <div className="flex justify-center items-center h-screen">
                        <div className="text-2xl">Loading... </div>
                        <div className="animate-spin h-5 w-5 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                }
            </ModalProvider>
        </>
    );
}
