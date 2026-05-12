"use server";

import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";
import { ScheduleStateRepository } from "@/app/repositories/ScheduleStateRepository";

const repository = new ScheduleStateRepository();

export async function listScheduleStates() {
  return repository.list();
}

export async function loadScheduleState(id: string): Promise<string | undefined> {
  const schedule = await repository.findById(id);

  return schedule ? ScheduleStateJson.toJson(schedule) : undefined;
}

export async function saveScheduleState(params: {
  id?: string;
  name?: string;
  scheduleJson: string;
}) {
  const schedule = ScheduleStateJson.fromJson(params.scheduleJson);
  const saved = await repository.save({
    id: params.id,
    name: params.name,
    schedule,
  });

  return {
    id: saved.id,
    name: saved.name,
    scheduleJson: ScheduleStateJson.toJson(saved.schedule),
  };
}

export async function createDefaultScheduleState(name?: string) {
  const saved = await repository.save({
    name,
    schedule: ScheduleStateManager.ScheduleStateManagerFactory(),
  });

  return {
    id: saved.id,
    name: saved.name,
    scheduleJson: ScheduleStateJson.toJson(saved.schedule),
  };
}

export async function deleteScheduleState(id: string): Promise<void> {
  await repository.delete(id);
}
