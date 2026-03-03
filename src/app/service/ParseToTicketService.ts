import { parseExcelClipboardTextSimple } from "../common/ExcelClipboardUtil";
import { UUID } from "../common/IdUtil";
import { ExcelClipboardParseTask } from "../models/excelClipboard/ExcelClipboardParseTask";
import { updatePreTaskIds } from "../models/excelClipboard/ExcelClipboardUtils";
import { ParseToTicket } from "../models/excelClipboard/ParseToTicket";
import { TaskManager } from "../models/TaskManager";
import { TicketManager } from "../models/Ticket";


export class ParseToTicketService {

    public parseAndUpdate(
        ticketId: UUID,
        ticketTitle: string,
        inputData: string,
        ticketManager: TicketManager,
        taskManager: TaskManager,
    ) {
        const excelParser = new ExcelClipboardParseTask();
        const parsedData = parseExcelClipboardTextSimple(inputData);
        const taskLines = excelParser.parseLines(parsedData);
        const taskMap = excelParser.toTaskMap(ticketId, ticketTitle, taskLines);
        const preTaskAdded = updatePreTaskIds(taskMap);

        const parseToTicket = new ParseToTicket();
        const newTicket = parseToTicket.fromTaskMap(ticketId, ticketTitle, preTaskAdded);

        ticketManager.addTicket(newTicket);
        taskManager.removeTasksFromTicketId(ticketId);
        taskManager.addTaskList(Array.from(preTaskAdded.values()).flat());

        return {
            newTicketManager: ticketManager,
            newTaskManager: taskManager,
        }


    }
}
