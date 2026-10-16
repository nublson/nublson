import { RichText } from "../rich-text";
import type { BlockProps } from "../types";

const CELL_CLASS =
  "border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right";

export function TableBlock({ block }: BlockProps<"table">) {
  const rows = (block.children ?? []).flatMap((row) =>
    row.type === "table_row" ? [{ id: row.id, cells: row.table_row.cells }] : [],
  );
  const hasHeader = block.table.has_column_header;
  const [firstRow, ...restRows] = rows;
  const headerRow = hasHeader ? firstRow : undefined;
  const bodyRows = hasHeader ? restRows : rows;

  return (
    <div
      className="w-full overflow-x-auto"
      tabIndex={0}
      role="region"
      aria-label="Table"
    >
      <table className="w-full text-sm">
        {headerRow != null && (
          <thead>
            <tr className="m-0 border-t p-0">
              {headerRow.cells.map((cell, index) => (
                <th
                  key={index}
                  className={`${CELL_CLASS} font-bold text-foreground bg-card`}
                >
                  <RichText text={cell} defaultColor="inherit" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row) => (
            <tr key={row.id} className="m-0 border-t p-0">
              {row.cells.map((cell, index) => (
                <td
                  key={index}
                  className={`${CELL_CLASS} text-muted-foreground`}
                >
                  <RichText text={cell} defaultColor="inherit" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
