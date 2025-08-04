import logo from "@/assets/logo.png";
import Image from "next/image";
import { useModal } from "../modal/ModalContext";
import SaveIcon from "./SaveIcon";
import DataImportExport from "../import/DataImportExport";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { Dispatch, SetStateAction } from "react";
import { PageContents } from "@/app/types/PageContents";

export default function Header(
    props: {
        schedule: ScheduleStateManager,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>,
        handleShowContent: (content: PageContents) => void,
    }
) {

    const { showModal, hideModal } = useModal();

    const { schedule, setSchedule, handleShowContent } = props;

    return (
        <header className="text-white px-4 py-2 sticky top-0 bg-blue-100 shadow-md z-50 rounded-b-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Image src={logo} alt={""} width={150} />
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={() => handleShowContent(PageContents.SCHEDULE_MAKER)}
                            >
                                Schedule Maker
                            </button>
                        </li>
                        <li>
                            <button
                                className="text-blue-500 hover:underline"
                                onClick={() => handleShowContent(PageContents.GANTT_CHART)}
                            >
                                Gantt Chart
                            </button>
                        </li>
                    </ul>
                    <ul className="flex space-x-4">
                        <SaveIcon onClick={() => showModal(() => <DataImportExport
                            schedule={schedule}
                            setSchedule={setSchedule}
                            hideModal={hideModal}
                        />)} />
                    </ul>
                </nav>
            </div>
        </header>
    );
}