import { Phase, PhaseEnum } from "@/app/common/PhaseEnum";
import { Task } from "../Task";
import { UUID } from "@/app/common/IdUtil";

/**
 * 元のタスクNoとフェーズから、タスクIDを取得するユーティリティ関数
 * @param phase 
 * @param no 
 * @param src 
 * @returns 
 */
export const getTaskIdFromNo = (phase: PhaseEnum, no: number, src: Map<PhaseEnum, (Task & { no: number })[]>): UUID => {
  const tasks = src.get(phase);
  if (!tasks) {
    throw new Error(`No tasks found for phase: ${phase}`);
  }
  const task = Array.from(tasks.values()).find(t => t.no === no);
  if (!task) {
    throw new Error(`No task found for phase: ${phase} with no: ${no}`);
  }

  return task.id;
}

export const getPreTaskIds = (taskId: UUID, src: Map<PhaseEnum, (Task & { no: number, preTaskNo: number[] })[]>): UUID[] => {

  for (const [phase, tasks] of src.entries()) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      return task.preTaskNo.map(preNo => getTaskIdFromNo(phase, preNo, src));
    }
  }

  return []; // タスクが見つからない場合は空の配列を返す
}

export const setPreTaskIds = (task: Task, preTaskIds: UUID[]) => {
  return { ...task, taskInformation: { ...task.taskInformation, premiseTaskIds: preTaskIds } };
}

export const updatePreTaskIds = (src: Map<PhaseEnum, (Task & { no: number, preTaskNo: number[] | undefined })[]>): Map<PhaseEnum, Task[]> => {

  const updatedSrc = new Map<PhaseEnum, Task[]>();
  for (const [phase, tasks] of src.entries()) {
    for (const task of tasks) {
      const preTaskIds = task.preTaskNo && isPreTaskNeedPhase(phase) ? task.preTaskNo.map(preNo => getTaskIdFromNo(phase, preNo, src)) : [];
      const updatedTask = setPreTaskIds(task, preTaskIds);
      if (!updatedSrc.has(phase)) {
        updatedSrc.set(phase, []);
      }
      updatedSrc.get(phase)!.push(updatedTask);
    }
  }
  return updatedSrc;
}

const isPreTaskNeedPhase = (phase: PhaseEnum): boolean => {
  // TODO 自由にフェーズを選べるようにする (現状は要件定義、設計、開発のみ前提 工数がない;;)
  return phase === Phase.REQUIREMENTS_DEFINITION || phase === Phase.DESIGN || phase === Phase.DEVELOPMENT;
}