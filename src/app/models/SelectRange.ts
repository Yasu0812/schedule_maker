
export type SelectRange = {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;

}

export const normSelectRange = (selectRange: SelectRange | undefined): SelectRange | undefined => {
    if (!selectRange) {
        return undefined;
    }
    const startRow = Math.min(selectRange.startRow, selectRange.endRow);
    const startCol = Math.min(selectRange.startCol, selectRange.endCol);
    const endRow = Math.max(selectRange.startRow, selectRange.endRow);
    const endCol = Math.max(selectRange.startCol, selectRange.endCol);
    return { startRow, startCol, endRow, endCol };
}

export const isInRange = (rowIndex: number, colIndex: number, selectRange: SelectRange | undefined): boolean => {
    if (!selectRange) {
        return false;
    }
    const normedRange = normSelectRange(selectRange);

    if (!normedRange) {
        return false;
    }
    
    return rowIndex >= normedRange.startRow && rowIndex <= normedRange.endRow && colIndex >= normedRange.startCol && colIndex <= normedRange.endCol;
}