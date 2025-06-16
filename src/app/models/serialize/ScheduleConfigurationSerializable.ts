import { ScheduleConfiguration } from "../ScheduleConfiguration";

export type ScheduleConfigurationSerializableType = {
    firstDateStr: string;
    lastDateStr: string;
}

export class ScheduleConfigurationSerializable {

    public static serialize(configuration: ScheduleConfiguration): ScheduleConfigurationSerializable {
        return {
            firstDateStr: configuration.firstDateStr,
            lastDateStr: configuration.lastDateStr
        };
    }

    public static deserialize(data: ScheduleConfigurationSerializableType): ScheduleConfiguration {
        return new ScheduleConfiguration(data.firstDateStr, data.lastDateStr);
    }
}