import { orderedPhases, phaseNameMap } from "@/app/common/PhaseEnum";
import { TicketMaterial } from "@/app/types/TicketType";

export default function TicketRegistrationBox(props: {
    addTicket: (ticketInfo: TicketMaterial) => void;
}) {

    const handleCreateTicket = (formData: FormData) => {
        const title = formData.get("title")?.toString();
        if (!title) {
            return;
        }

        const description = formData.get("description")?.toString() || "";
        const phases = orderedPhases.map((phase) => {
            const rawDuration = formData.get(`duration-${phase}`)?.toString();
            const duration = rawDuration ? parseInt(rawDuration) : 0;
            return {
                phase,
                duration: duration,
                description: formData.get(`description-${phase}`)?.toString() || "",
            };
        }).filter((phase) => phase.duration > 0);
        const ticket: TicketMaterial = {
            title: title,
            description: description,
            phases: phases,
        };
        props.addTicket(ticket);
    };

    return (
        <form action={handleCreateTicket}>
            <div className="flex items-center gap-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Register New Ticket</h2>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">タイトル</label>
                <input
                    type="text"
                    placeholder="例: API設計チケット"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    name="title"
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                {orderedPhases.map((phase, index) => (
                    <div key={index} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-800">{phaseNameMap[phase]}</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={0}
                                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-green-400"
                                name={`duration-${phase}`}
                            />
                            <span className="text-xs text-gray-500">days</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-2">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-md font-semibold hover:from-green-600 hover:to-green-800 transition">
                    Create Ticket
                </button>
            </div>
        </form>
    );
}