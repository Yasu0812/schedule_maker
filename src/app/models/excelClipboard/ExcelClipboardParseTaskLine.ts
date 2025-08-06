import { UUID } from "../../common/IdUtil";
import { PhaseEnum, Phase } from "../../common/PhaseEnum";
import { Task } from "../Task";

export interface ITaskLineProps {
    no: number;
    isNew: boolean;
    taskKind: string;
    taskName: string;
    feature: string;
    description: string;
    requirementsDefinition: number;
    design: number;
    development: number;
    unitTest: number;
    integrationTestInternal: number;
    integrationTestExternal: number;
    performanceTest: number;
    memberGroup: string | undefined;
}


export class ExcelClipboardParseTaskLine implements ITaskLineProps {
    no: number;
    isNew: boolean;
    taskKind: string;
    taskName: string;
    feature: string;
    description: string;
    requirementsDefinition: number;
    design: number;
    development: number;
    unitTest: number;
    integrationTestInternal: number;
    integrationTestExternal: number;
    performanceTest: number;
    memberGroup: string | undefined;


    constructor(props: string[]) {
        const _props: string[] = props.map(prop => prop.trim());
        const expectedLength = 14;
        while (_props.length < expectedLength) {
            _props.push(""); // Fill missing columns with empty strings
        }

        this.no = parseInt(_props[0]);
        this.isNew = _props[1] === "新規";
        this.taskKind = _props[2];
        this.taskName = _props[3];
        this.feature = _props[4];
        this.description = _props[5];
        this.requirementsDefinition = this.parseNumber(_props[6]);
        this.design = this.parseNumber(_props[7]);
        this.development = this.parseNumber(_props[8]);
        this.unitTest = this.parseNumber(_props[9]);
        this.integrationTestInternal = this.parseNumber(_props[10]);
        this.integrationTestExternal = this.parseNumber(_props[11]);
        this.performanceTest = this.parseNumber(_props[12]);
        this.memberGroup = this.parseMemberGroup(_props[13]);
    }

    private parseNumber(value: string): number {
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    private parseMemberGroup(value: string): string | undefined {
        return value.trim() === "" ? undefined : value.trim();
    }

    private toTask(ticketId: UUID, ticketTitle: string, phase: PhaseEnum, duration: number): Task {
        const taskInformation = {
            taskName: this.taskName,
            description: this.description,
            premiseTaskIds: [],
            groupTaskId: this.memberGroup || undefined,
        };

        return Task.create(ticketId, ticketTitle, phase, duration, taskInformation);
    }

    public toTasks(ticketId: UUID, ticketTitle: string): Map<PhaseEnum, Task> {

        const tasks = new Map<PhaseEnum, Task>();
        const requirementsDefinitionTask = this.toTask(ticketId, ticketTitle, Phase.REQUIREMENTS_DEFINITION, this.requirementsDefinition);
        if (requirementsDefinitionTask.duration > 0) {
            tasks.set(Phase.REQUIREMENTS_DEFINITION, requirementsDefinitionTask);
        }
        const designTask = this.toTask(ticketId, ticketTitle, Phase.DESIGN, this.design);
        if (designTask.duration > 0) {
            tasks.set(Phase.DESIGN, designTask);
        }
        const developmentTask = this.toTask(ticketId, ticketTitle, Phase.DEVELOPMENT, this.development);
        if (developmentTask.duration > 0) {
            tasks.set(Phase.DEVELOPMENT, developmentTask);
        }
        const unitTestTask = this.toTask(ticketId, ticketTitle, Phase.UNIT_TEST, this.unitTest);
        if (unitTestTask.duration > 0) {
            tasks.set(Phase.UNIT_TEST, unitTestTask);
        }
        const integrationTestTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_INTERNAL, this.integrationTestInternal);
        if (integrationTestTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_INTERNAL, integrationTestTask);
        }
        const integrationTestExternalTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_EXTERNAL, this.integrationTestExternal);
        if (integrationTestExternalTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_EXTERNAL, integrationTestExternalTask);
        }
        const performanceTestTask = this.toTask(ticketId, ticketTitle, Phase.PERFORMANCE_TEST, this.performanceTest);
        if (performanceTestTask.duration > 0) {
            tasks.set(Phase.PERFORMANCE_TEST, performanceTestTask);
        }

        return tasks;

    }

    public parseLines(lines: string[][]): ExcelClipboardParseTaskLine[] {
        const taskLines: ExcelClipboardParseTaskLine[] = [];
        for (const line of lines) {
            if (line.length < 14) {
                throw new Error("Invalid line format. Expected at least 14 columns.");
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
}
