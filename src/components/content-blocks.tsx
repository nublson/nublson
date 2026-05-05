import { getListBlockItems } from "@/utils/formatter";
import {
  withContentValidation,
  type Text as NotionRichText,
} from "@9gustin/react-notion-render";
import { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import React from "react";
import { CoverImage } from "./cover-image";
import { Typography } from "./typography";

type ListBlockVariant = "bullet" | "numbered";
type NotionTextLike = { plain_text?: string };
type TableCellLike = NotionTextLike[] | { text?: NotionTextLike[] };
type TableRowLike =
  | { cells?: TableCellLike[] }
  | { content?: { cells?: TableCellLike[] } }
  | { table_row?: { cells?: TableCellLike[] } };
type TableBlockLike = {
  content?: {
    hasColumnHeader?: boolean;
  };
  items?: TableRowLike[];
};

const LIST_BLOCK_VARIANT: Record<
  ListBlockVariant,
  { tag: "ul" | "ol"; className: string; testId: string }
> = {
  bullet: {
    tag: "ul",
    className: "list list-outside list-disc w-full ps-6",
    testId: "bulleted-list-item",
  },
  numbered: {
    tag: "ol",
    className: "list list-outside list-decimal w-full ps-6",
    testId: "numbered-list-item",
  },
};

export const ImageBlock = withContentValidation((props: DropedProps) => {
  return (
    <CoverImage
      src={props.media?.src ?? ""}
      alt={props.media?.alt ?? ""}
      className="my-10"
    />
  );
});

export const VideoBlock = withContentValidation((props: DropedProps) => {
  const embedUrl = props.media?.src?.replace("watch?v=", "embed/");

  return (
    <iframe
      src={embedUrl}
      title="Embedded video"
      className="aspect-video w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
});

export const Heading1Block = withContentValidation((props: DropedProps) => {
  return (
    <Typography component="h1" variant="h2" className="mt-10">
      {props.children}
    </Typography>
  );
});

export const Heading2Block = withContentValidation((props: DropedProps) => {
  return (
    <Typography component="h2" variant="h3" className="mt-10">
      {props.children}
    </Typography>
  );
});

export const Heading3Block = withContentValidation((props: DropedProps) => {
  return (
    <Typography component="h3" variant="h4" className="mt-10">
      {props.children}
    </Typography>
  );
});

type NotionRichTextElementProps = NotionRichText & {
  children?: React.ReactNode;
};

function isNotionRichTextElementProps(
  value: unknown,
): value is NotionRichTextElementProps {
  if (value == null || typeof value !== "object") {
    return false;
  }
  const plain = (value as { plain_text?: unknown }).plain_text;
  return typeof plain === "string";
}

function mapParagraphChildren(children: React.ReactNode): React.ReactNode[] {
  return (
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const props = child.props as unknown;
      if (!isNotionRichTextElementProps(props)) {
        return child;
      }

      const { plain_text, href, children: innerChildren } = props;
      const text =
        plain_text ?? (typeof innerChildren === "string" ? innerChildren : "");

      if (href != null && href !== "") {
        return (
          <a
            href={href}
            className="underline underline-offset-2 hover:text-accent-foreground transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={text}
          >
            {text}
          </a>
        );
      }
      return text;
    }) ?? []
  );
}

export const ParagraphBlock = withContentValidation((props: DropedProps) => {
  const hasChildren = React.Children.count(props.children) > 0;
  const content = hasChildren
    ? mapParagraphChildren(props.children)
    : (props.plainText ?? "");

  return <Typography data-testid="paragraph">{content}</Typography>;
});

function listItemsFromProps(props: DropedProps): string[] {
  if (props.config?.block != null) {
    return getListBlockItems(
      props.config.block as Parameters<typeof getListBlockItems>[0],
    );
  }
  if (props.plainText != null) {
    return [props.plainText];
  }
  return [];
}

function ListBlockView(props: DropedProps & { variant: ListBlockVariant }) {
  const { variant, ...rest } = props;
  const items = listItemsFromProps(rest);
  const { tag: Tag, className, testId } = LIST_BLOCK_VARIANT[variant];

  return (
    <Tag className={className} data-testid={testId}>
      {items.map((text, i) => (
        <Typography component="li" key={i}>
          {text}
        </Typography>
      ))}
    </Tag>
  );
}

export const BulletListBlock = withContentValidation((props: DropedProps) => (
  <ListBlockView {...props} variant="bullet" />
));

export const NumberedListBlock = withContentValidation((props: DropedProps) => (
  <ListBlockView {...props} variant="numbered" />
));

export const CalloutBlock = withContentValidation((props: DropedProps) => {
  return (
    <div className="w-full p-3 rounded-md">
      <Typography>{props.children}</Typography>
    </div>
  );
});

export const CodeBlock = withContentValidation((props: DropedProps) => {
  return (
    <pre className="w-full">
      <code>{props.children}</code>
    </pre>
  );
});

export const QuoteBlock = withContentValidation((props: DropedProps) => {
  return (
    <blockquote className="w-full border-l-2 italic text-muted-foreground pl-4">
      <Typography>{props.children}</Typography>
    </blockquote>
  );
});

function getTableRowsFromBlock(block: unknown): {
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

export const TableBlock = withContentValidation((props: DropedProps) => {
  const { hasColumnHeader, rows } = getTableRowsFromBlock(props.config?.block);
  const [firstRow, ...restRows] = rows;
  const headerRow = hasColumnHeader ? firstRow : undefined;
  const bodyRows = hasColumnHeader ? restRows : rows;
  const cellClassName =
    "border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right";

  return (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full">
        {headerRow != null && (
          <thead>
            <tr className="m-0 border-t p-0">
              {headerRow.map((cell, index) => (
                <th
                  key={`header-cell-${index}`}
                  className={`${cellClassName} text-accent-foreground font-bold`}
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
