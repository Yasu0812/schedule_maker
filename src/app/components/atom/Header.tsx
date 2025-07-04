import logo from "@/assets/logo.png";
import Image from "next/image";
import { useModal } from "../modal/ModalContext";
import SaveIcon from "./SaveIcon";
import DataImportExport from "../import/DataImportExport";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { Dispatch, SetStateAction } from "react";

export default function Header(
    props: {
        schdule: ScheduleStateManager,
        setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>
    }
) {

    const { showModal, hideModal } = useModal();

    const { schdule, setSchedule } = props;


    return (
        <header className="text-white px-4 py-2 sticky top-0 bg-blue-100 shadow-md z-50 rounded-b-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Image src={logo} alt={""} width={150} />
                </div>
                <nav>
                    <ul className="flex space-x-4">
                        <SaveIcon onClick={() => showModal(() => <DataImportExport
                            schedule={schdule}
                            setSchedule={setSchedule}
                            hideModal={hideModal}
                        />)} />
                    </ul>
                </nav>
            </div>
        </header>
    );
}