import type { TableBlockLike } from "./types";

export function getTableRowsFromBlock(block: unknown): {
  hasColumnHeader: boolean;
  rows: string[][];
} {
  if (block == null || typeof block !== "object") {
    return { hasColumnHeader: false, rows: [] };
  }

  const tableBlock = block as TableBlockLike;
  const rawRows = Array.isArray(tableBlock.items) ? tableBlock.items : [];

  const rows = rawRows.map((row) => {
    const rowCells =
      ("content" in row && row.content?.cells) ||
      ("table_row" in row && row.table_row?.cells) ||
      ("cells" in row && row.cells) ||
      [];

    return rowCells.map((cell) => {
      const textEntries = Array.isArray(cell) ? cell : (cell.text ?? []);
      return textEntries.map((text) => text.plain_text ?? "").join("");
    });
  });

  return {
    hasColumnHeader: tableBlock.content?.hasColumnHeader === true,
    rows,
  };
}
