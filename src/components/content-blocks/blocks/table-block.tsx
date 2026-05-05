import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { getTableRowsFromBlock } from "../table-utils";

export const TableBlock = withContentValidation((props: DropedProps) => {
  const { hasColumnHeader, rows } = getTableRowsFromBlock(props.config?.block);
  const [firstRow, ...restRows] = rows;
  const headerRow = hasColumnHeader ? firstRow : undefined;
  const bodyRows = hasColumnHeader ? restRows : rows;
  const cellClassName =
    "border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right";

  return (
    <div className="w-full overflow-y-auto">
      <table className="w-full">
        {headerRow != null && (
          <thead>
            <tr className="m-0 border-t p-0">
              {headerRow.map((cell, index) => (
                <th
                  key={`header-cell-${index}`}
                  className={`${cellClassName} font-bold text-accent-foreground bg-card`}
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={`body-row-${rowIndex}`} className="m-0 border-t p-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={`body-cell-${rowIndex}-${cellIndex}`}
                  className={`${cellClassName} text-muted-foreground`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
