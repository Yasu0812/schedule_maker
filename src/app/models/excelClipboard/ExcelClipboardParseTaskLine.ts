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
    unitTestDocumentCreation: number;
    unitTest: number;
    integrationTestInternalDocumentCreation: number;
    integrationTestInternal: number;
    integrationTestExternalDocumentCreation: number;
    integrationTestExternal: number;
    performanceTestDocumentCreation: number;
    performanceTest: number;
    memberGroup: string | undefined;
    premiseTaskNos: number[] | undefined;
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
    unitTestDocumentCreation: number;
    unitTest: number;
    integrationTestInternalDocumentCreation: number;
    integrationTestInternal: number;
    integrationTestExternalDocumentCreation: number;
    integrationTestExternal: number;
    performanceTestDocumentCreation: number;
    performanceTest: number;
    memberGroup: string | undefined;
    premiseTaskNos: number[] | undefined;


    constructor(props: string[]) {
        const _props: string[] = props.map(prop => prop.trim());
        const expectedLength = 17;
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
        this.unitTestDocumentCreation = this.parseNumber(_props[9]);
        this.unitTest = this.parseNumber(_props[10]);
        this.integrationTestInternalDocumentCreation = this.parseNumber(_props[11]);
        this.integrationTestInternal = this.parseNumber(_props[12]);
        this.integrationTestExternalDocumentCreation = this.parseNumber(_props[13]);
        this.integrationTestExternal = this.parseNumber(_props[14]);
        this.performanceTestDocumentCreation = this.parseNumber(_props[15]);
        this.performanceTest = this.parseNumber(_props[16]);
        this.memberGroup = this.parseMemberGroup(_props[17]);
        this.premiseTaskNos = this.parsePremiseTaskNos(_props[18]);
    }

    private parseNumber(value: string): number {
        const parsed = parseInt(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    private parseMemberGroup(value: string): string | undefined {
        return value.trim() === "" ? undefined : value.trim();
    }

    private parsePremiseTaskNos(value: string): number[] | undefined {
        if (value.trim() === "") {
            return undefined;
        }
        return value.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));
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
        const unitTestDocumentCreationTask = this.toTask(ticketId, ticketTitle, Phase.UNIT_TEST_DOCUMENT_CREATION, this.unitTestDocumentCreation);
        if (unitTestDocumentCreationTask.duration > 0) {
            tasks.set(Phase.UNIT_TEST_DOCUMENT_CREATION, unitTestDocumentCreationTask);
        }
        const unitTestTask = this.toTask(ticketId, ticketTitle, Phase.UNIT_TEST, this.unitTest);
        if (unitTestTask.duration > 0) {
            tasks.set(Phase.UNIT_TEST, unitTestTask);
        }
        const integrationTestInternalDocumentCreationTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION, this.integrationTestInternalDocumentCreation);
        if (integrationTestInternalDocumentCreationTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION, integrationTestInternalDocumentCreationTask);
        }
        const integrationTestTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_INTERNAL, this.integrationTestInternal);
        if (integrationTestTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_INTERNAL, integrationTestTask);
        }
        const integrationTestExternalDocumentCreationTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION, this.integrationTestExternalDocumentCreation);
        if (integrationTestExternalDocumentCreationTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION, integrationTestExternalDocumentCreationTask);
        }
        const integrationTestExternalTask = this.toTask(ticketId, ticketTitle, Phase.INTEGRATION_TEST_EXTERNAL, this.integrationTestExternal);
        if (integrationTestExternalTask.duration > 0) {
            tasks.set(Phase.INTEGRATION_TEST_EXTERNAL, integrationTestExternalTask);
        }
        const performanceTestDocumentCreationTask = this.toTask(ticketId, ticketTitle, Phase.PERFORMANCE_TEST_DOCUMENT_CREATION, this.performanceTestDocumentCreation);
        if (performanceTestDocumentCreationTask.duration > 0) {
            tasks.set(Phase.PERFORMANCE_TEST_DOCUMENT_CREATION, performanceTestDocumentCreationTask);
        }
        const performanceTestTask = this.toTask(ticketId, ticketTitle, Phase.PERFORMANCE_TEST, this.performanceTest);
        if (performanceTestTask.duration > 0) {
            tasks.set(Phase.PERFORMANCE_TEST, performanceTestTask);
        }

        return tasks;

    }

}
