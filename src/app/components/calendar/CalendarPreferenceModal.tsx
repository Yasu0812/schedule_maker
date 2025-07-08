import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import HolidayPreference from "./HolidayPreference";


export default function CalendarPreferenceModal(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;

    return (
        <div className="p-4" >
            <h3 className="text-lg font-semibold mb-2">Preferences</h3>
            <HolidayPreference
                scheduleConfiguration={scheduleConfiguration}
                handleScheduleConfigurationChange={handleScheduleConfigurationChange}
            />
        </div>
    );
}