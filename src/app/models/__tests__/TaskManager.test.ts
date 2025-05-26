import { TaskManager } from "../TaskManager";
import { Task } from "../Task";
import { Ticket } from "../Ticket";
import { TicketMaterial, } from "@/app/types/TicketType";
import { Phase } from "@/app/common/PhaseEnum";

describe("TaskManager", () => {
    it("should create a TaskManager from a list of tasks", () => {
        const task1 = new Task(randomUUID(), randomUUID(), 5);
        const task2 = new Task(randomUUID(), randomUUID(), 10);

        const taskManager = new TaskManager([task1, task2]);

        expect(taskManager.getTask(task1.id)).toBe(task1);
        expect(taskManager.getTask(task2.id)).toBe(task2);
    });

    it("should create a TaskManager from a list of tickets", () => {

        const ticketListMat: TicketMaterial[] = [
            {
                title: "Ticket 1",
                description: "Description 1",
                phases: [
                    { duration: 5, phase: Phase.DESIGN, description: "Detail 1" },
                    { duration: 10, phase: Phase.DEVELOPMENT, description: "Detail 2" }
                ]
            },
            {
                title: "Ticket 2",
                description: "Description 2",
                phases: [
                    { duration: 15, phase: Phase.INTEGRATION_TEST_EXTERNAL, description: "Detail 3" },
                    { duration: 20, phase: Phase.UNIT_TEST, description: "Detail 4" }
                ]
            }
        ];

        const ticketList: Ticket[] = ticketListMat.map(ticket => Ticket.TicketFactory(ticket));
        const taskManager = TaskManager.TaskManagerFactory(ticketList);

        const taskManagerId = taskManager.getFromTicketPhaseId(ticketList[0].phases.get(Phase.DESIGN)!.detailid)[0].id;
        const taskId = ticketList[0].phases.get(Phase.DESIGN)?.detailid;

        expect(taskManager.getTask(taskManagerId)).toBeDefined();
        expect(taskManager.getTask(taskManagerId)?.ticketPhaseId).toBe(taskId);
    });

});