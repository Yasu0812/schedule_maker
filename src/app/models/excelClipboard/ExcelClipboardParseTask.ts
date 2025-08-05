import { UUID } from "crypto";
import { PhaseEnum } from "../../common/PhaseEnum";
import { ExcelClipboardParseTaskLine, } from "./ExcelClipboardParseTaskLine";
import { Task } from "../Task";
import { parseExcelClipboardTextSimple } from "@/app/common/ExcelClipboardUtil";

export class ExcelClipboardParseTask {
    public parseLines(lines: string[][]): ExcelClipboardParseTaskLine[] {
        const taskLines: ExcelClipboardParseTaskLine[] = [];
        for (const line of lines) {
            if (line.length < 14) {
                throw new Error("Invalid line format. Expected at least 14 columns.");
            }
            if (line[0].trim() === "") {
                continue; // Skip empty lines
            }else if (!parseInt(line[0].trim())) {
                continue; // Skip lines that do not start with a number (e.g., task ID)
            }
            const taskLine = new ExcelClipboardParseTaskLine(line);
            taskLines.push(taskLine);
        }
        return taskLines;
    }

    public toTaskMap(ticketId: UUID, ticketTitle: string, taskLines: ExcelClipboardParseTaskLine[]): Map<PhaseEnum, Task> {
        const tasks = new Map<PhaseEnum, Task>();
        for (const line of taskLines) {
            const lineTasks = line.toTasks(ticketId, ticketTitle);
            lineTasks.forEach((task, phase) => {
                tasks.set(phase, task);
            });
        }
        return tasks;
    }

    public parseTaskMap(
        ticketId: UUID,
        ticketTitle: string,
        inputData: string
    ): Map<PhaseEnum, Task> {
        const parsedData = parseExcelClipboardTextSimple(inputData);
        const taskLines = this.parseLines(parsedData);
        return this.toTaskMap(ticketId, ticketTitle, taskLines);
    }
}