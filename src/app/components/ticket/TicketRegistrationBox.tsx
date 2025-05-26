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

    const phaseInputBoxes = orderedPhases.map((phase) => {
        return (
            <div key={phase} style={{ width: '45%' }}>
                <div>{phaseNameMap[phase]}</div>
                <input type="number" placeholder={`days`} name={`duration-${phase}`} />
            </div>
        );
    });

    return (
        <div className="common-box" style={{ maxWidth: '600px' }}>
            <form action={handleCreateTicket}>
                <h2>Register New Ticket</h2>
                <hr style={{ padding: '0.5rem' }} />
                <div>タイトル</div>
                <input type="text" placeholder="Ticket Title" name="title" />
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {phaseInputBoxes}
                </div>

                <button type="submit">Create Ticket</button>

            </form>
        </div>
    );
}