import { DateUtil } from "@/app/common/DateUtil";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import SettingIcon from "../atom/SettingIcon";
import { useModal } from "../modal/ModalContext";
import CalendarPreferenceModal from "./CalendarPreferenceModal";


export default function CalendarPreference(props: {
    scheduleConfiguration: ScheduleConfiguration,
    handleScheduleConfigurationChange: (scheduleConfiguration: ScheduleConfiguration) => void,
}) {
    const { scheduleConfiguration, handleScheduleConfigurationChange } = props;

    const { showModal, } = useModal();

    const handlePreferenceClick = () => {
        showModal(() =>
            <CalendarPreferenceModal
                scheduleConfiguration={scheduleConfiguration}
                handleScheduleConfigurationChange={handleScheduleConfigurationChange}
            />
        );
    }

    return (
        <>
            <input type="date" className="border rounded p-2"
                value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.firstDate)}
                onChange={(e) => {
                    const newFirstDate = DateUtil.parseDateWithHyphen(e.target.value);
                    const newConfig = scheduleConfiguration.updateFirstDate(newFirstDate);
                    handleScheduleConfigurationChange(newConfig);
                }}
            />
            -
            <input type="date" className="border rounded p-2"
                value={DateUtil.formatDateWithHyphenNoTimeZone(scheduleConfiguration.lastDate)}
                onChange={(e) => {
                    const newLastDate = DateUtil.parseDateWithHyphen(e.target.value);
                    const newConfig = scheduleConfiguration.updateLastDate(newLastDate);
                    handleScheduleConfigurationChange(newConfig);
                }}
            />
            <SettingIcon
                onClick={() => {
                    handlePreferenceClick();
                }}
                className={`cursor-pointer`}
            />
        </>
    );
}