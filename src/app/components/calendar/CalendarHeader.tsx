import { DateUtil } from "@/app/common/DateUtil";

export default function CalendarHeader(props: { dayListItems: Date[] }) {
    const dayList = props.dayListItems;

    const dayListItems = dayList.map((day, index) => {
        return (
            <th key={index} className="calendar-header-item">
                {DateUtil.formatDateShow(day)}
            </th>
        );
    });

    return (
        <tr>
            <th className="calendar-header-item">Member</th>
            {dayListItems}
        </tr>
    );
}
