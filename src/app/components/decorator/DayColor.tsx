import { DateUtil } from "@/app/common/DateUtil";

export default function DayColor(props: {
    dayString: string, //yyyy-mm-dd
    isAdditionalHoliday: boolean, // Optional additional holidays
    children: React.ReactNode,
}) {
    const { dayString, children } = props;

    const dayOfWeekString = DateUtil.getDayOfWeekStringFromString(dayString);

    // FIXME 土曜日かつ祝日の場合、土曜カラーになる問題
    const holidayClass = props.isAdditionalHoliday && !(dayOfWeekString === "saturday") ? "holiday" : "";


    return (
        <div className={`${holidayClass} ${dayOfWeekString} `}>
            {children}
        </div>
    );
}