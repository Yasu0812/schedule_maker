

export function parseExcelClipboardTextSimple(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                cell += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === '\t' && !inQuote) {
            row.push(cell);
            cell = '';
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuote) {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = '';
            if (char === '\r') i++; // skip LF in CRLF
        } else {
            cell += char;
        }
    }

    // 最後のセルと行
    row.push(cell);
    rows.push(row);

    return rows;
}
