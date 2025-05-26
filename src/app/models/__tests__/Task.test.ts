import { Task } from "../Task";

describe("Task", () => {
    it("should create a Task instance with the correct properties", () => {
        const id = randomUUID();
        const detailId = randomUUID();
        const duration = 10;

        const task = new Task(id, detailId, duration);

        expect(task.id).toBe(id);
        expect(task.ticketPhaseId).toBe(detailId);
        expect(task.duration).toBe(duration);
    });


});