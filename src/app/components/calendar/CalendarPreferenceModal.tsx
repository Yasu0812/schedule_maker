import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";


export default function CalendarPreferenceModal(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;

    return (
        <div className="p-4" >
            <h3 className="text-lg font-semibold mb-2">Preferences</h3>
            <h4>Holidays</h4>
            {
                scheduleConfiguration.additionalHolidays.map((holiday, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input type="date" className="border rounded p-2"
                            value={DateUtil.formatDateWithHyphenNoTimeZone(holiday)}
                            onChange={(e) => {
                                const newHoliday = DateUtil.parseDateWithHyphen(e.target.value);
                                const newHolidays = [...scheduleConfiguration.additionalHolidays];
                                newHolidays[index] = newHoliday;
                                const newConfig = scheduleConfiguration.updateDates(scheduleConfiguration.firstDate, scheduleConfiguration.lastDate)
                                    .updateAdditionalHolidays(newHolidays);
                                handleScheduleConfigurationChange(newConfig);
                            }}
                        />
                        <button className="text-red-500" onClick={() => {
                            const newHolidays = scheduleConfiguration.additionalHolidays.filter((_, i) => i !== index);
                            const newConfig = scheduleConfiguration.updateDates(scheduleConfiguration.firstDate, scheduleConfiguration.lastDate)
                                .updateAdditionalHolidays(newHolidays);
                            handleScheduleConfigurationChange(newConfig);
                        }}>Remove</button>
                    </div>
                ))
            }
            <button className="bg-blue-500 text-white rounded p-2"
                onClick={() => {
                    const newHolidays = [...scheduleConfiguration.additionalHolidays, new Date()];
                    const newConfig = scheduleConfiguration.updateDates(scheduleConfiguration.firstDate, scheduleConfiguration.lastDate)
                        .updateAdditionalHolidays(newHolidays);
                    handleScheduleConfigurationChange(newConfig);
                }}>
                Add Holiday
            </button>
        </div>
    );
}