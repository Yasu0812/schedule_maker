import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { useState } from "react";


export default function HolidayInputForm(props: {
    scheduleConfiguration: ScheduleConfiguration,
    date: Date,
    update: (date: Date) => void,
    del: () => void,
}) {
    const { date, update, del } = props;
    const [inputDate, setInputDate] = useState(DateUtil.formatDateWithHyphenNoTimeZone(date));

    return (
        <div className="flex items-center gap-2 mb-2">
            <input type="date" className="border rounded p-2"
                value={inputDate}
                onChange={(e) => {
                    setInputDate(e.target.value);
                }}
                onBlur={() => {
                    const newDate = DateUtil.parseDateWithHyphen(inputDate);
                    update(newDate);
                }}
            />
            <button className="text-red-500" onClick={del}>Remove</button>
        </div>
    );
}