import { TaskMergeSplitter } from "../TaskMergeSplitter";
import { Task } from "../Task";
import { generateUUID } from "@/app/common/IdUtil";

describe("TaskMergeSplitter", () => {
    let taskMergeSplitter: TaskMergeSplitter;

    beforeEach(() => {
        taskMergeSplitter = new TaskMergeSplitter();
    });

    describe("splitTask", () => {
        it("should split a task into multiple tasks with specified durations", () => {
            const task = new Task(generateUUID(), generateUUID(), 10);
            const durations = [3, 7];

            const splitTasks = taskMergeSplitter.splitTask(task, durations);

            expect(splitTasks).toHaveLength(2);
            expect(splitTasks[0].duration).toBe(3);
            expect(splitTasks[1].duration).toBe(7);
            expect(splitTasks[0].ticketPhaseId).toBe(task.ticketPhaseId);
            expect(splitTasks[1].ticketPhaseId).toBe(task.ticketPhaseId);
        });
    });

    describe("splitTaskByHalf", () => {
        it("should split a task into two tasks with half durations (rounded up and down)", () => {
            const task = new Task(randomUUID(), randomUUID(), 9);

            const splitTasks = taskMergeSplitter.splitTaskByHalf(task);

            expect(splitTasks).toHaveLength(2);
            expect(splitTasks[0].duration).toBe(5); // ceil(9 / 2)
            expect(splitTasks[1].duration).toBe(4); // floor(9 / 2)
            expect(splitTasks[0].ticketPhaseId).toBe(task.ticketPhaseId);
            expect(splitTasks[1].ticketPhaseId).toBe(task.ticketPhaseId);
        });

        it("should handle even durations correctly", () => {
            const task = new Task(randomUUID(), randomUUID(), 8);

            const splitTasks = taskMergeSplitter.splitTaskByHalf(task);

            expect(splitTasks).toHaveLength(2);
            expect(splitTasks[0].duration).toBe(4);
            expect(splitTasks[1].duration).toBe(4);
        });
    });

    describe("mergeTasks", () => {
        it("should merge multiple tasks into one with combined duration", () => {
            const task1 = new Task(randomUUID(), randomUUID(), 5);
            const task2 = new Task(randomUUID(), task1.ticketPhaseId, 10);
            const task3 = new Task(randomUUID(), task1.ticketPhaseId, 15);

            const mergedTask = taskMergeSplitter.mergeTasks([task1, task2, task3]);

            expect(mergedTask.duration).toBe(30); // 5 + 10 + 15
            expect(mergedTask.ticketPhaseId).toBe(task1.ticketPhaseId);
        });

        it("should throw an error if no tasks are provided", () => {
            expect(() => taskMergeSplitter.mergeTasks([])).toThrow("No tasks to merge");
        });

        it("should throw an error if tasks have different detailIds", () => {
            const task1 = new Task(randomUUID(), randomUUID(), 5);
            const task2 = new Task(randomUUID(), randomUUID(), 10);

            expect(() => taskMergeSplitter.mergeTasks([task1, task2])).toThrow(
                "All tasks must have the same detailId to merge"
            );
        });

        it("should return the same task if only one task is provided", () => {
            const task = new Task(randomUUID(), randomUUID(), 10);

            const mergedTask = taskMergeSplitter.mergeTasks([task]);

            expect(mergedTask).toBe(task);
        });
    });
});