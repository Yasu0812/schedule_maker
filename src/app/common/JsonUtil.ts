export const toSerializable = (obj: unknown): unknown => {
    if (obj instanceof Map) {
        return {
            __type: 'Map',
            value: Array.from(obj.entries()).map(([key, val]) => [
                toSerializable(key),
                toSerializable(val),
            ]),
        };
    }

    if (obj instanceof Set) {
        return {
            __type: 'Set',
            value: Array.from(obj).map(toSerializable),
        };
    }

    if (obj instanceof Date) {
        return { __type: 'Date', value: obj.toISOString() };
    }

    if (obj instanceof RegExp) {
        return { __type: 'RegExp', value: obj.toString() };
    }

    if (Array.isArray(obj)) {
        return obj.map(toSerializable);
    }

    if (obj !== null && typeof obj === 'object') {
        const result: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(obj)) {
            result[key] = toSerializable(val);
        }
        return result;
    }

    // Primitive value
    return obj;
}
