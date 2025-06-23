import { ScheduleCsvConverter } from "../models/ScheduleCsvConverter";
import { ScheduleStateManager } from "../models/ScheduleStateManager";


export class ScheduleToCsvService {

    private _scheduleCsvConverter = new ScheduleCsvConverter();

    public toCsv(schedule: ScheduleStateManager): string {
        return this._scheduleCsvConverter.toCsv(schedule);
    }
}