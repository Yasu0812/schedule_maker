
export const parseNumber = (value: string | null): number => {
    if (value === null) {
        return 0;
    }
    const parsedValue = parseInt(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
}