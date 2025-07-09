import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";


export default function CalendarPreference(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;

    return (
        <>
            <input type="date" className="border rounded p-2"
                value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.firstDate)}
                onChange={(e) => {
                    const newFirstDate = DateUtil.parseDateWithHyphen(e.target.value);
                    const newConfig = scheduleConfiguration.updateFirstDate(newFirstDate);
                    handleScheduleConfigurationChange(newConfig);
                }}
            />
            -
            <input type="date" className="border rounded p-2"
                value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.lastDate)}
                onChange={(e) => {
                    const newLastDate = DateUtil.parseDateWithHyphen(e.target.value);
                    const newConfig = scheduleConfiguration.updateLastDate(newLastDate);
                    handleScheduleConfigurationChange(newConfig);
                }}
            />
            <button className="ml-2 border rounded p-2"
                onClick={() => {
                    const newConfig = scheduleConfiguration.toggleShowHoliday();
                    handleScheduleConfigurationChange(newConfig);
                }}>
                {scheduleConfiguration.isShowHoliday ? "Hide Holidays" : "Show Holidays"}
            </button>
        </>
    );
}