import { generateUUID, UUID } from "../common/IdUtil";
import { AssignedTask } from "./AssignedTask";

export class Gantt {
    constructor(
        public ganttBars: GanttBar[] = [],
    ) { }

    public static fromAssignedTasks(assignedTasks: Iterable<AssignedTask>): Gantt {
        const ganttBars = Array.from(assignedTasks).map(task => GanttBar.fromAssignedTask(task));
        return new Gantt(ganttBars);
    }

    public getGanttBars(): GanttBar[] {
        return this.ganttBars
            .sort((a, b) => {
                if (a.memberId < b.memberId) return -1
                if (a.memberId > b.memberId) return 1
                return 0;
            })
            .sort((a, b) => {
                if (a.taskId < b.taskId) return -1
                if (a.taskId > b.taskId) return 1
                return 0;
            })
            .sort((a, b) => {
                if (a.startDay < b.startDay) return -1
                if (a.startDay > b.startDay) return 1
                return 0;
            }).sort((a, b) => {
                if (a.ticketId < b.ticketId) return -1
                if (a.ticketId > b.ticketId) return 1
                return 0;
            })
    }

}

export class GanttBar {
    constructor(
        public id: UUID,
        public _assignedTask: AssignedTask,
    ) { }

    public static fromAssignedTask(assignedTask: AssignedTask): GanttBar {
        return new GanttBar(generateUUID(), assignedTask);
    }

    public get startDay(): Date {
        return this._assignedTask.startDay;
    }

    public get endDay(): Date {
        return this._assignedTask.endDay;
    }

    public get taskId(): UUID {
        return this._assignedTask.taskId;
    }

    public get memberId(): UUID {
        return this._assignedTask.memberId;
    }

    public get ticketId(): UUID {
        return this._assignedTask.ticketId;
    }
}