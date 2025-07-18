
export function generateUUID(): UUID {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID() as UUID;
    }
    // 簡易なフォールバック
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }) as UUID;
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;