import type { BlockWithChildren } from "@/services/notion";
import type { ReactNode } from "react";

export type NotionBlock = BlockWithChildren;

/** A Notion block of one type, with its typed payload. */
export type BlockOf<T extends NotionBlock["type"]> = Extract<
  NotionBlock,
  { type: T }
>;

export type BlockProps<T extends NotionBlock["type"]> = {
  block: BlockOf<T>;
  /** The block's nested blocks, rendered; undefined when it has none. */
  children?: ReactNode;
};

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
