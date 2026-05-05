import type { Text as NotionRichText } from "@9gustin/react-notion-render";
import type { ReactNode } from "react";

export type ListBlockVariant = "bullet" | "numbered";

export type RichTextAnnotationsLike = {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
};

export type ListTextPartLike = {
  plain_text?: string;
  href?: string;
  annotations?: RichTextAnnotationsLike;
  text?: { content?: string; link?: { url?: string } | null };
};

export type ListItemLike = { content?: { text?: ListTextPartLike[] } };
export type ListBlockLike = { items?: ListItemLike[] };

export type NotionTextLike = { plain_text?: string };

export type TableCellLike = NotionTextLike[] | { text?: NotionTextLike[] };

export type TableRowLike =
  | { cells?: TableCellLike[] }
  | { content?: { cells?: TableCellLike[] } }
  | { table_row?: { cells?: TableCellLike[] } };

export type TableBlockLike = {
  content?: {
    hasColumnHeader?: boolean;
  };
  items?: TableRowLike[];
};

export type NotionRichTextElementProps = NotionRichText & {
  children?: ReactNode;
};
