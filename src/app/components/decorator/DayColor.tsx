import { DateUtil } from "@/app/common/DateUtil";

export default function DayColor(props: {
    dayString: string, //yyyy-mm-dd
    additionalHolidays: string[], // Optional additional holidays
    children: React.ReactNode,
}) {
    const { dayString, children } = props;

    const dayOfWeekString = DateUtil.getDayOfWeekStringFromString(dayString);

    const isAdditionalHoliday = props.additionalHolidays.includes(dayString);

    const holidayClass = isAdditionalHoliday ? "holiday" : "";


    return (
        <div className={`${dayOfWeekString} ${holidayClass}`}>
            {children}
        </div>
    );
}