import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import {
  ScheduleStateMapper,
  scheduleStateInclude,
} from "@/app/repositories/ScheduleStateMapper";

type TransactionClient = Prisma.TransactionClient;

export type ScheduleStateSummary = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SaveScheduleStateParams = {
  id?: string;
  name?: string;
  schedule: ScheduleStateManager;
};

export type SavedScheduleState = {
  id: string;
  name: string;
  schedule: ScheduleStateManager;
};

export class ScheduleStateRepository {
  public async list(): Promise<ScheduleStateSummary[]> {
    return prisma.scheduleState.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  public async findById(id: string): Promise<ScheduleStateManager | undefined> {
    const record = await prisma.scheduleState.findUnique({
      where: { id },
      include: scheduleStateInclude,
    });

    return record ? ScheduleStateMapper.toDomain(record) : undefined;
  }

  public async save(
    params: SaveScheduleStateParams,
  ): Promise<SavedScheduleState> {
    return prisma.$transaction(async (tx) => {
      const scheduleState = params.id
        ? await tx.scheduleState.upsert({
            where: { id: params.id },
            update: {
              name: params.name,
            },
            create: {
              id: params.id,
              name: params.name,
            },
          })
        : await tx.scheduleState.create({
            data: {
              name: params.name,
            },
          });

      await this.replaceChildren(tx, scheduleState.id, params.schedule);

      const savedRecord = await tx.scheduleState.findUniqueOrThrow({
        where: {
          id: scheduleState.id,
        },
        include: scheduleStateInclude,
      });

      return {
        id: savedRecord.id,
        name: savedRecord.name,
        schedule: ScheduleStateMapper.toDomain(savedRecord),
      };
    });
  }

  public async delete(id: string): Promise<void> {
    await prisma.scheduleState.delete({
      where: { id },
    });
  }

  private async replaceChildren(
    tx: TransactionClient,
    scheduleStateId: string,
    schedule: ScheduleStateManager,
  ): Promise<void> {
    await this.deleteChildren(tx, scheduleStateId);

    const data = ScheduleStateMapper.toPersistenceData(
      scheduleStateId,
      schedule,
    );

    await tx.scheduleConfiguration.create({
      data: data.configuration,
    });

    await this.createManyIfNotEmpty(tx.ticket, data.tickets);
    await this.createManyIfNotEmpty(tx.ticketPhase, data.ticketPhases);
    await this.createManyIfNotEmpty(tx.task, data.tasks);
    await this.createManyIfNotEmpty(tx.taskInformation, data.taskInformations);
    await this.createManyIfNotEmpty(tx.taskDependency, data.taskDependencies);
    await this.createManyIfNotEmpty(tx.member, data.members);
    await this.createManyIfNotEmpty(tx.mileStone, data.mileStones);
    await this.createManyIfNotEmpty(tx.assignedTask, data.assignedTasks);
  }

  private async deleteChildren(
    tx: TransactionClient,
    scheduleStateId: string,
  ): Promise<void> {
    await tx.assignedTask.deleteMany({ where: { scheduleStateId } });
    await tx.taskDependency.deleteMany({ where: { scheduleStateId } });
    await tx.taskInformation.deleteMany({ where: { scheduleStateId } });
    await tx.task.deleteMany({ where: { scheduleStateId } });
    await tx.ticketPhase.deleteMany({ where: { scheduleStateId } });
    await tx.ticket.deleteMany({ where: { scheduleStateId } });
    await tx.member.deleteMany({ where: { scheduleStateId } });
    await tx.mileStone.deleteMany({ where: { scheduleStateId } });
    await tx.scheduleConfiguration.deleteMany({ where: { scheduleStateId } });
  }

  private async createManyIfNotEmpty<T extends { createMany(args: { data: D[] }): Promise<unknown> }, D>(
    delegate: T,
    data: D[],
  ): Promise<void> {
    if (data.length === 0) {
      return;
    }

    await delegate.createMany({ data });
  }
}
