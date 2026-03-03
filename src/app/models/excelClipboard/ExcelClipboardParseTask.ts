import { UUID } from "crypto";
import { PhaseEnum } from "../../common/PhaseEnum";
import { ExcelClipboardParseTaskLine, } from "./ExcelClipboardParseTaskLine";
import { Task } from "../Task";

export class ExcelClipboardParseTask {
    public parseLines(lines: string[][]): ExcelClipboardParseTaskLine[] {
        const taskLines: ExcelClipboardParseTaskLine[] = [];
        console.log("Parsing lines:", lines);
        for (const line of lines) {
            if (line.length < 12) {
                continue; // Skip lines that do not have enough columns
            }
            if (line[0].trim() === "") {
                continue; // Skip empty lines
            } else if (!parseInt(line[0].trim())) {
                continue; // Skip lines that do not start with a number (e.g., task ID)
            }
            const taskLine = new ExcelClipboardParseTaskLine(line);
            taskLines.push(taskLine);
        }
        return taskLines;
    }

    public toTaskMap(ticketId: UUID, ticketTitle: string, taskLines: ExcelClipboardParseTaskLine[]): Map<PhaseEnum, (Task & { no: number, preTaskNo: number[] | undefined })[]> {
        const tasks = new Map<PhaseEnum, (Task & { no: number, preTaskNo: number[] | undefined })[]>();
        for (const line of taskLines) {
            const lineTasks = line.toTasks(ticketId, ticketTitle);
            lineTasks.forEach((task, phase) => {
                if (!tasks.has(phase)) {
                    tasks.set(phase, []);
                }
                const taskWithNo = { ...task, no: line.no, preTaskNo: line.premiseTaskNos };
                tasks.get(phase)!.push(taskWithNo);
            });
        }
        return tasks;
    }
}