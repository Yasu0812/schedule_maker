import { ScheduleConfiguration } from "../models/ScheduleConfiguration";

export class ScheduleConfigurationService {

    public getDefault(): ScheduleConfiguration {
        return ScheduleConfiguration.createDefaultConfiguration();
    }

    public updateFirstDate(configuration: ScheduleConfiguration, firstDate: Date | string): ScheduleConfiguration {
        return configuration.updateFirstDate(firstDate);
    }

    public updateLastDate(configuration: ScheduleConfiguration, lastDate: Date | string): ScheduleConfiguration {
        return configuration.updateLastDate(lastDate);
    }

    public updateDates(configuration: ScheduleConfiguration, firstDate: Date | string, lastDate: Date | string): ScheduleConfiguration {
        return configuration.updateDates(firstDate, lastDate);
    }
}