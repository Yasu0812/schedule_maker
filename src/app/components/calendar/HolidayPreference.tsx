import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { useState } from "react";
import HolidayInputForm from "./HolidayInputForm";


export default function HolidayPreference(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;
    const [inputDate, setInputDate] = useState("");
    const [holidayList, setHolidayList] = useState(scheduleConfiguration.additionalHolidays);

    const addHoliday = () => {
        const newHoliday = DateUtil.parseDateWithHyphen(inputDate);
        const newHolidays = [...holidayList, newHoliday];
        const newConfig = scheduleConfiguration.updateAdditionalHolidays(newHolidays);
        setHolidayList(newHolidays);
        handleScheduleConfigurationChange(newConfig);
        setInputDate("");
    }

    const updateHolidayList = (newHolidays: Date[]) => {
        const newConfig = scheduleConfiguration.updateAdditionalHolidays(newHolidays);
        setHolidayList(newConfig.additionalHolidays);
        handleScheduleConfigurationChange(newConfig);
    }

    return (
        <>
            <h4>Holidays</h4>
            {
                holidayList.map((holiday, index) => (
                    <HolidayInputForm
                        key={holiday.toISOString()}
                        date={holiday}
                        update={(date) => {
                            const newHolidays = holidayList;
                            newHolidays[index] = date;
                            updateHolidayList(newHolidays);
                        }}
                        del={() => {
                            const newHolidays = holidayList.filter((_, i) => i !== index);
                            updateHolidayList(newHolidays);
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
            {
                holidayList.toString()
            }
        </>
    );
}