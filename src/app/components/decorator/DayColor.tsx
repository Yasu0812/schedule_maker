import { DateUtil } from "@/app/common/DateUtil";

export default function DayColor(props: {
    dayString: string, //yyyy-mm-dd
    children: React.ReactNode,
}) {
    const { dayString, children } = props;

    const dayOfWeekString = DateUtil.getDayOfWeekStringFromString(dayString);

    return (
        <div className={`${dayOfWeekString}`}>
            {children}
        </div>
    );
}