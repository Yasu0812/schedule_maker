import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { ScheduleConfigurationService } from "@/app/service/ScheduleConfigurationService";
import { useState } from "react";
import HolidayInputForm from "./HolidayInputForm";


export default function HolidayPreference(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;
    const [inputDate, setInputDate] = useState("");

    const addHoliday = () => {
        const newHoliday = DateUtil.parseDateWithHyphen(inputDate);
        const newConfig = new ScheduleConfigurationService().addAdditionalHoliday(scheduleConfiguration, newHoliday);
        handleScheduleConfigurationChange(newConfig);
        setInputDate("");
    }

    return (
        <>
            <h4>Holidays</h4>
            {
                scheduleConfiguration.additionalHolidays.map((holiday, index) => (
                    <HolidayInputForm
                        key={holiday.getTime()}
                        scheduleConfiguration={scheduleConfiguration}
                        date={holiday}
                        update={(date) => {
                            const newHolidays = [...scheduleConfiguration.additionalHolidays];
                            newHolidays[index] = date;
                            const newConfig = scheduleConfiguration.updateAdditionalHolidays(newHolidays);
                            handleScheduleConfigurationChange(newConfig);
                        }}
                        del={() => {
                            const newHolidays = scheduleConfiguration.additionalHolidays.filter((_, i) => i !== index);
                            const newConfig = scheduleConfiguration.updateAdditionalHolidays(newHolidays);
                            handleScheduleConfigurationChange(newConfig);
                        }}
                    />
                ))
            }
            <div className="flex items-center gap-2 mb-2">
                <input type="date" className="border rounded p-2"
                    value={inputDate}
                    onChange={(e) => setInputDate(e.target.value)}
                />
                <button className="bg-green-500 text-white rounded p-2"
                    onClick={addHoliday}>
                    Add
                </button>
            </div>
        </>
    );
}