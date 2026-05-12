import { Phase as PrismaPhase, Prisma } from "@prisma/client";
import { generateUUID, UUID } from "@/app/common/IdUtil";
import { PhaseEnum, Phase } from "@/app/common/PhaseEnum";
import { AssignedTask } from "@/app/models/AssignedTask";
import { CalendarCellTaskManager } from "@/app/models/CalendarCellTask";
import Member from "@/app/models/Member";
import { MemberManager } from "@/app/models/MemberManager";
import { MileStone } from "@/app/models/MileStone";
import { MileStoneManager } from "@/app/models/MileStoneManager";
import { PlanedTask } from "@/app/models/PlanedTask";
import { PlanedTaskMapper } from "@/app/models/PlanedTaskMapper";
import { ScheduleConfiguration } from "@/app/models/ScheduleConfiguration";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { Task } from "@/app/models/Task";
import { TaskInformation } from "@/app/models/TaskInformation";
import { TaskManager } from "@/app/models/TaskManager";
import { Ticket, TicketManager, TicketPhase } from "@/app/models/Ticket";

export const scheduleStateInclude = {
  configuration: true,
  tickets: {
    include: {
      phases: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
  tasks: {
    include: {
      taskInformation: true,
      premiseTasks: true,
    },
    orderBy: {
      id: "asc",
    },
  },
  assignedTasks: {
    orderBy: {
      startDay: "asc",
    },
  },
  members: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  mileStones: {
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ScheduleStateInclude;

export type ScheduleStateRecord = Prisma.ScheduleStateGetPayload<{
  include: typeof scheduleStateInclude;
}>;

export type ScheduleStatePersistenceData = {
  configuration: Prisma.ScheduleConfigurationCreateManyInput;
  tickets: Prisma.TicketCreateManyInput[];
  ticketPhases: Prisma.TicketPhaseCreateManyInput[];
  tasks: Prisma.TaskCreateManyInput[];
  taskInformations: Prisma.TaskInformationCreateManyInput[];
  taskDependencies: Prisma.TaskDependencyCreateManyInput[];
  members: Prisma.MemberCreateManyInput[];
  assignedTasks: Prisma.AssignedTaskCreateManyInput[];
  mileStones: Prisma.MileStoneCreateManyInput[];
};

const appToPrismaPhaseMap: Record<PhaseEnum, PrismaPhase> = {
  [Phase.REQUIREMENTS_DEFINITION]: PrismaPhase.REQUIREMENTS_DEFINITION,
  [Phase.DESIGN]: PrismaPhase.DESIGN,
  [Phase.DEVELOPMENT]: PrismaPhase.DEVELOPMENT,
  [Phase.UNIT_TEST_DOCUMENT_CREATION]: PrismaPhase.UNIT_TEST_DOCUMENT_CREATION,
  [Phase.UNIT_TEST]: PrismaPhase.UNIT_TEST,
  [Phase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION]:
    PrismaPhase.INTEGRATION_TEST_INTERNAL_DOCUMENT_CREATION,
  [Phase.INTEGRATION_TEST_INTERNAL]: PrismaPhase.INTEGRATION_TEST_INTERNAL,
  [Phase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION]:
    PrismaPhase.INTEGRATION_TEST_EXTERNAL_DOCUMENT_CREATION,
  [Phase.INTEGRATION_TEST_EXTERNAL]: PrismaPhase.INTEGRATION_TEST_EXTERNAL,
  [Phase.PERFORMANCE_TEST_DOCUMENT_CREATION]:
    PrismaPhase.PERFORMANCE_TEST_DOCUMENT_CREATION,
  [Phase.PERFORMANCE_TEST]: PrismaPhase.PERFORMANCE_TEST,
};

const prismaToAppPhaseMap = Object.fromEntries(
  Object.entries(appToPrismaPhaseMap).map(([appPhase, prismaPhase]) => [
    prismaPhase,
    appPhase,
  ]),
) as Record<PrismaPhase, PhaseEnum>;

export class ScheduleStateMapper {
  public static toPersistenceData(
    scheduleStateId: string,
    schedule: ScheduleStateManager,
  ): ScheduleStatePersistenceData {
    const tickets = schedule.ticketManager.getTicketList();
    const tasks = Array.from(schedule.taskManager.getTaskAll().values());
    const members = schedule.memberManager.members;
    const assignedTasks = schedule.planedTaskManager.getAll();
    const mileStones = schedule.mileStoneManager.getAllMileStones();

    return {
      configuration: {
        scheduleStateId,
        firstDate: schedule.scheduleConfiguration.firstDate,
        lastDate: schedule.scheduleConfiguration.lastDate,
        additionalHolidays: schedule.scheduleConfiguration.additionalHolidays,
        isShowHoliday: schedule.scheduleConfiguration.isShowHoliday,
      },
      tickets: tickets.map((ticket, index) => ({
        id: ticket.id,
        scheduleStateId,
        title: ticket.title,
        description: ticket.description,
        enabled: ticket.enabled,
        sortOrder: index,
      })),
      ticketPhases: tickets.flatMap((ticket) =>
        Array.from(ticket.phases.values()).map((phase, index) => ({
          scheduleStateId,
          ticketId: ticket.id,
          phase: this.toPrismaPhase(phase.phase),
          duration: phase.duration,
          description: phase.description,
          sortOrder: index,
        })),
      ),
      tasks: tasks.map((task) => ({
        id: task.id,
        scheduleStateId,
        ticketId: task.ticketId,
        ticketTitle: task.ticketTitle,
        phase: this.toPrismaPhase(task.phase),
        duration: task.duration,
      })),
      taskInformations: tasks.map((task) => ({
        id: task.taskInformation.id,
        scheduleStateId,
        taskId: task.id,
        taskName: task.taskInformation.taskName,
        description: task.taskInformation.description,
        groupTaskId: task.taskInformation.groupTaskId,
      })),
      taskDependencies: tasks.flatMap((task) =>
        task.taskInformation.premiseTaskIds.map((premiseTaskId) => ({
          scheduleStateId,
          taskId: task.id,
          premiseTaskId,
        })),
      ),
      members: members.map((member, index) => ({
        id: member.id,
        scheduleStateId,
        name: member.name,
        disableDates: member.disableDates,
        isAvailable: member.isAvailable,
        sortOrder: index,
      })),
      assignedTasks: assignedTasks.map((assignedTask) => ({
        id: assignedTask.id,
        scheduleStateId,
        ticketId: assignedTask.ticketId,
        taskId: assignedTask.taskId,
        memberId: assignedTask.memberId,
        startDay: assignedTask.startDay,
        endDay: assignedTask.endDay,
      })),
      mileStones: mileStones.map((mileStone, index) => ({
        id: mileStone.id,
        scheduleStateId,
        name: mileStone.name,
        day: mileStone.day,
        prePhases: Array.from(mileStone.prePhases).map((phase) =>
          this.toPrismaPhase(phase),
        ),
        postPhases: Array.from(mileStone.postPhases).map((phase) =>
          this.toPrismaPhase(phase),
        ),
        sortOrder: index,
      })),
    };
  }

  public static toDomain(record: ScheduleStateRecord): ScheduleStateManager {
    if (!record.configuration) {
      throw new Error(`ScheduleState ${record.id} does not have configuration.`);
    }

    const ticketManager = new TicketManager(
      record.tickets.map(
        (ticket) =>
          new Ticket(
            ticket.id as UUID,
            ticket.title,
            ticket.description,
            ticket.enabled,
            new Map(
              ticket.phases.map((phase) => {
                const appPhase = this.toAppPhase(phase.phase);
                return [
                  appPhase,
                  new TicketPhase(
                    phase.duration,
                    appPhase,
                    phase.description,
                  ),
                ];
              }),
            ),
          ),
      ),
    );

    const taskManager = new TaskManager(
      new Map(
        record.tasks.map((task) => [
          task.id as UUID,
          new Task(
            task.id as UUID,
            task.ticketId as UUID,
            task.ticketTitle,
            this.toAppPhase(task.phase),
            task.duration,
            new TaskInformation(
              (task.taskInformation?.id as UUID | undefined) ?? generateUUID(),
              task.taskInformation?.taskName ?? "",
              task.taskInformation?.description ?? "",
              task.premiseTasks.map(
                (premiseTask) => premiseTask.premiseTaskId as UUID,
              ),
              task.taskInformation?.groupTaskId ?? undefined,
            ),
          ),
        ]),
      ),
    );

    const memberManager = new MemberManager(
      new Map(
        record.members.map((member) => [
          member.id as UUID,
          Member.factory(
            member.id as UUID,
            member.name,
            member.disableDates,
            member.isAvailable,
          ),
        ]),
      ),
    );

    const scheduleConfiguration = new ScheduleConfiguration(
      record.configuration.firstDate,
      record.configuration.lastDate,
      record.configuration.additionalHolidays,
      record.configuration.isShowHoliday,
    );

    const planedTaskManager = new PlanedTask(
      new Map(
        record.assignedTasks.map((assignedTask) => [
          assignedTask.taskId as UUID,
          new AssignedTask(
            assignedTask.id as UUID,
            assignedTask.ticketId as UUID,
            assignedTask.taskId as UUID,
            assignedTask.memberId as UUID,
            assignedTask.startDay,
            assignedTask.endDay,
          ),
        ]),
      ),
    );

    const mileStoneManager = new MileStoneManager(
      new Map(
        record.mileStones.map((mileStone) => [
          mileStone.id as UUID,
          new MileStone(
            mileStone.id as UUID,
            mileStone.name,
            mileStone.day ?? undefined,
            mileStone.prePhases.map((phase) => this.toAppPhase(phase)),
            mileStone.postPhases.map((phase) => this.toAppPhase(phase)),
          ),
        ]),
      ),
    );

    const calendarMap = new PlanedTaskMapper().toCalendar(
      memberManager.members,
      ticketManager,
      taskManager,
      planedTaskManager,
      mileStoneManager,
      scheduleConfiguration,
    );

    const calendarManager = new CalendarCellTaskManager(
      memberManager.ids,
      calendarMap,
      scheduleConfiguration.firstDate,
      scheduleConfiguration.lastDate,
    );

    return new ScheduleStateManager(
      calendarManager,
      taskManager,
      ticketManager,
      planedTaskManager,
      memberManager,
      scheduleConfiguration,
      mileStoneManager,
    );
  }

  private static toPrismaPhase(phase: PhaseEnum): PrismaPhase {
    return appToPrismaPhaseMap[phase];
  }

  private static toAppPhase(phase: PrismaPhase): PhaseEnum {
    return prismaToAppPhaseMap[phase];
  }
}
