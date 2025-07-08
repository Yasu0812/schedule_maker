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

    public addAdditionalHoliday(configuration: ScheduleConfiguration, date: Date): ScheduleConfiguration {
        const existingHoliday = configuration.isExistingHoliday(date);
        if (existingHoliday) {
            return configuration; // No change if the holiday already exists
        }
        const newHolidays = [...configuration.additionalHolidays, date];
        return configuration.updateAdditionalHolidays(newHolidays);
    }

    public removeAdditionalHoliday(configuration: ScheduleConfiguration, index: number): ScheduleConfiguration {
        if (index < 0 || index >= configuration.additionalHolidays.length) {
            throw new Error("Index out of bounds for additional holidays.");
        }
        const newHolidays = configuration.additionalHolidays.filter((_, i) => i !== index);
        return configuration.updateAdditionalHolidays(newHolidays);
    }
}