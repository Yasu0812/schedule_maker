import { orderedPhases, phaseNameMap, phaseNameReverseMap } from "../common/PhaseEnum";
import { TicketMaterial } from "../types/TicketType";

export class TicketCsvConverter {

    private _defaultHeader: string = "title," + orderedPhases.map(phase => `${phaseNameMap[phase]}`).join(',');

    public ticketMaterialFromCsv(csv: string): TicketMaterial[] {
        const lines = csv.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
            return [];
        }

        const hasHeader = lines[0].startsWith('title');

        const header = hasHeader ? lines[0].trim() : this._defaultHeader;
        // TODO チケットの名前を変更時に、重複チェックをかけること
        const tickets: TicketMaterial[] = [];
        for (const line of lines) {
            const ticket = this.lineToTicketMaterial(line, header);
            if (ticket) {
                tickets.push(ticket);
            }
        }

        return tickets;
    }

    private lineToTicketMaterial(line: string, header: string): TicketMaterial | null {
        const values = line.split(',').map(value => value.trim());
        const headerValues = header.split(',').map(value => value.trim());
        if (values.length < 2) {
            return null; // Invalid line
        }

        const title = values[0];
        const phases: { phase: string, duration: number, description: string, }[] = [];

        for (let i = 1; i < values.length; i++) {
            const phaseName = headerValues[i];
            const phaseValue = values[i];
            if (!phaseName || !phaseValue) {
                continue; // Skip empty phases
            }
            const phaseEnum = phaseNameReverseMap[phaseName];

            const duration = parseInt(phaseValue, 10);
            if (isNaN(duration)) {
                continue; // Skip invalid duration
            }
            phases.push({
                duration: duration,
                phase: phaseEnum,
                description: '' // Description is empty in CSV
            });
        }

        if (phases.length === 0) {
            return null; // No valid phases
        }
        return {
            title: title,
            description: '',
            enabled: true,
            phases: phases.map(phase => ({
                phase: phase.phase,
                duration: phase.duration,
                description: phase.description
            }))
        };
    }

}