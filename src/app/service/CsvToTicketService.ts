import { parsePhase, PhaseEnum } from "../common/PhaseEnum";
import { ScheduleStateManager } from "../models/ScheduleStateManager";
import { TicketCsvConverter } from "../models/TicketCsvConverter";
import { TicketDurationReconciler } from "../models/TicketDurationReconciler";
import { TicketRegistration } from "../models/TicketRegistration";
import { TicketResolver } from "../models/TicketResolver";

export class CsvToTicketService {

    private _ticketCsvConverter: TicketCsvConverter = new TicketCsvConverter();

    private _ticketResolver: TicketResolver = new TicketResolver();

    private _ticketDurationReconciler: TicketDurationReconciler = new TicketDurationReconciler();

    private _ticketRegistration: TicketRegistration = new TicketRegistration();

    public updateFromCsv(
        csv: string,
        scheduleStateManager: ScheduleStateManager,
    ): ScheduleStateManager {
        const { ticketManager, taskManager, planedTaskManager, scheduleConfiguration } = scheduleStateManager;
        const newTickets = this._ticketCsvConverter.ticketMaterialFromCsv(csv);

        let newTicketManager = ticketManager;
        let newTaskManager = taskManager;
        let newPlanedTaskManager = planedTaskManager;


        if (newTickets.length === 0) {
            throw new Error("No valid tickets found in the CSV");
        }

        for (const ticket of newTickets) {
            if (!ticket.title || ticket.title.trim() === "") {
                throw new Error("Ticket title cannot be empty");
            }

            const old = this._ticketResolver.fromTicketTitleWithTask(ticket.title, ticketManager, taskManager);

            if (old) {
                const ticketPhaseDurationMap = new Map<PhaseEnum, number>(
                    ticket.phases.map(phase => [parsePhase(phase.phase), phase.duration])
                );
                const res = this._ticketDurationReconciler.changeDurations(
                    old.ticket.id,
                    ticketPhaseDurationMap,
                    ticketManager,
                    taskManager,
                    planedTaskManager,
                    scheduleConfiguration
                );
                
                newTicketManager = res.ticketManager;
                newTaskManager = res.taskManager;
                newPlanedTaskManager = res.planedTaskManager;

            } else {
                // Add new ticket
                const res = this._ticketRegistration.createNewTicket(
                    ticketManager,
                    taskManager,
                    ticket
                )
                newTicketManager = res.ticketManager;
                newTaskManager = res.taskManager;
            }
        }

        return new ScheduleStateManager(
            scheduleStateManager.calandarManager,
            newTaskManager,
            newTicketManager,
            newPlanedTaskManager,
            scheduleStateManager.memberManager,
            scheduleStateManager.scheduleConfiguration,
            scheduleStateManager.mileStoneManager
        );


    }
}
