import { UUID } from "../common/IdUtil";
import { ExcelClipboardParseTask } from "../models/excelClipboard/ExcelClipboardParseTask";
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
        const taskMap = excelParser.parseTaskMap(ticketId, ticketTitle, inputData);

        const parseToTicket = new ParseToTicket();
        const newTicket = parseToTicket.fromTaskMap(ticketId, ticketTitle, taskMap);

        ticketManager.addTicket(newTicket);
        taskManager.removeTasksFromTicketId(ticketId);
        taskManager.addTaskList(Array.from(taskMap.values()).flat());

        return {
            newTicketManager: ticketManager,
            newTaskManager: taskManager,
        }


    }
}
