"use client";

import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import {
    createDefaultScheduleState,
    listScheduleStates,
    loadScheduleState,
    renameScheduleState,
} from "@/app/actions/scheduleStateActions";
import {
    LOCAL_STORAGE_SCHEDULE_KEY,
    LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY,
} from "@/app/common/LocalStorageKeys";
import { ScheduleStateManager } from "@/app/models/ScheduleStateManager";
import { ScheduleStateJson } from "@/app/models/serialize/ScheduleStateJson";

type ScheduleStateSummary = Awaited<ReturnType<typeof listScheduleStates>>[number];

export function DbProjectManager(props: {
    setSchedule: Dispatch<SetStateAction<ScheduleStateManager | undefined>>;
    hideModal: () => void;
}) {
    const [projects, setProjects] = useState<ScheduleStateSummary[]>([]);
    const [selectedId, setSelectedId] = useState("");
    const [newProjectName, setNewProjectName] = useState("");
    const [selectedProjectName, setSelectedProjectName] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [message, setMessage] = useState<string | undefined>();
    const [isPending, startTransition] = useTransition();

    const refreshProjects = () => {
        startTransition(async () => {
            try {
                const summaries = await listScheduleStates();
                const currentId = localStorage.getItem(LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY) ?? summaries[0]?.id ?? "";
                setProjects(summaries);
                setSelectedId(currentId);
                setSelectedProjectName(summaries.find((project) => project.id === currentId)?.name ?? "");
            } catch (error) {
                console.error("Failed to list schedule states:", error);
                setMessage("DB一覧の取得に失敗しました。");
            }
        });
    };

    useEffect(() => {
        refreshProjects();
    }, []);

    const handleSelectProject = (id: string) => {
        setSelectedId(id);
        setSelectedProjectName(projects.find((project) => project.id === id)?.name ?? "");
        setIsEditingName(false);
    };

    const startEditingName = () => {
        setSelectedProjectName(projects.find((project) => project.id === selectedId)?.name ?? "");
        setIsEditingName(true);
    };

    const stopEditingName = () => {
        setSelectedProjectName(projects.find((project) => project.id === selectedId)?.name ?? "");
        setIsEditingName(false);
    };

    const loadSelectedProject = () => {
        if (!selectedId) {
            setMessage("プロジェクトを選択してください。");
            return;
        }

        startTransition(async () => {
            try {
                const scheduleJson = await loadScheduleState(selectedId);
                if (!scheduleJson) {
                    setMessage("選択したプロジェクトが見つかりません。");
                    return;
                }

                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY, selectedId);
                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, scheduleJson);
                props.setSchedule(ScheduleStateJson.fromJson(scheduleJson));
                props.hideModal();
            } catch (error) {
                console.error("Failed to load schedule state:", error);
                setMessage("DBロードに失敗しました。");
            }
        });
    };

    const createProject = () => {
        const name = newProjectName.trim();
        if (!name) {
            setMessage("新規プロジェクト名を入力してください。");
            return;
        }

        startTransition(async () => {
            try {
                const created = await createDefaultScheduleState(name);

                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_STATE_ID_KEY, created.id);
                localStorage.setItem(LOCAL_STORAGE_SCHEDULE_KEY, created.scheduleJson);
                props.setSchedule(ScheduleStateJson.fromJson(created.scheduleJson));
                props.hideModal();
            } catch (error) {
                console.error("Failed to create schedule state:", error);
                setMessage("新規プロジェクト作成に失敗しました。");
            }
        });
    };

    const renameProject = () => {
        if (!selectedId) {
            setMessage("プロジェクトを選択してください。");
            return;
        }

        const name = selectedProjectName.trim();
        if (!name) {
            setMessage("プロジェクト名を入力してください。");
            return;
        }

        startTransition(async () => {
            try {
                const renamed = await renameScheduleState({
                    id: selectedId,
                    name,
                });

                setProjects((currentProjects) =>
                    currentProjects.map((project) =>
                        project.id === renamed.id
                            ? { ...project, name: renamed.name }
                            : project,
                    ),
                );
                setIsEditingName(false);
                setMessage("プロジェクト名を更新しました。");
            } catch (error) {
                console.error("Failed to rename schedule state:", error);
                setMessage("プロジェクト名の更新に失敗しました。");
            }
        });
    };

    return (
        <>
            <h2 className="text-lg font-semibold pb-2 mb-2 border-b">DB Project</h2>
            <div className="mb-3 flex flex-wrap items-center gap-2">
                {!isEditingName && (
                    <>
                        <select
                            className="min-w-64 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 disabled:bg-gray-100"
                            disabled={isPending || projects.length === 0}
                            onChange={(event) => handleSelectProject(event.target.value)}
                            value={selectedId}
                        >
                            {projects.length === 0 && (
                                <option value="">No projects</option>
                            )}
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        <button
                            className="rounded bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
                            disabled={isPending || !selectedId}
                            onClick={loadSelectedProject}
                            type="button"
                        >
                            Load
                        </button>
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-blue-300"
                            disabled={isPending || !selectedId}
                            onClick={startEditingName}
                            title="Edit project name"
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                        </button>
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                            disabled={isPending}
                            onClick={refreshProjects}
                            title="Refresh projects"
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
                                <path d="M3 3v5h5" />
                                <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
                                <path d="M16 16h5v5" />
                            </svg>
                        </button>
                    </>
                )}
                {isEditingName && (
                    <>
                        <input
                            className="min-w-64 rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
                            disabled={isPending || !selectedId}
                            onChange={(event) => setSelectedProjectName(event.target.value)}
                            placeholder="Project name"
                            type="text"
                            value={selectedProjectName}
                        />
                        <button
                            className="rounded border border-blue-300 px-4 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-blue-300"
                            disabled={isPending || !selectedId}
                            onClick={renameProject}
                            type="button"
                        >
                            Rename
                        </button>
                        <button
                            className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
                            disabled={isPending}
                            onClick={stopEditingName}
                            title="Back"
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 12H5" />
                                <path d="m12 19-7-7 7-7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                <input
                    className="min-w-64 rounded border border-gray-300 px-3 py-2 text-sm text-gray-800"
                    disabled={isPending}
                    onChange={(event) => setNewProjectName(event.target.value)}
                    placeholder="New project name"
                    type="text"
                    value={newProjectName}
                />
                <button
                    className="rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
                    disabled={isPending}
                    onClick={createProject}
                    type="button"
                >
                    New Project
                </button>
            </div>
            {message && (
                <p className="mb-4 text-sm text-red-600">
                    {message}
                </p>
            )}
        </>
    );
}
