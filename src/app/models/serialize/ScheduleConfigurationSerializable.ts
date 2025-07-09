import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "../ScheduleConfiguration";

export type ScheduleConfigurationSerializableType = {
    firstDateStr: string;
    lastDateStr: string;
    additionalHolidays: string[];
    isShowHoliday: boolean;

}

export class ScheduleConfigurationSerializable {

    public static serialize(configuration: ScheduleConfiguration): ScheduleConfigurationSerializable {
        return {
            firstDateStr: configuration.firstDateStr,
            lastDateStr: configuration.lastDateStr,
            additionalHolidays: configuration.additionalHolidays.map(date => DateUtil.formatDate(date)),
            isShowHoliday: configuration.isShowHoliday
        };
    }

    public static deserialize(data: ScheduleConfigurationSerializableType): ScheduleConfiguration {
        return new ScheduleConfiguration(data.firstDateStr, data.lastDateStr, data.additionalHolidays.map(dateStr => DateUtil.parseDate(dateStr)), data.isShowHoliday);
    }
}