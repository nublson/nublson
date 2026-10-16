import type { RichTextItemResponse } from "@notionhq/client";
import type { ReactNode } from "react";
import { prerender } from "react-dom/static";
import type { NotionBlock } from "./types";

let counter = 0;

/** A Notion block fixture of the given type. */
export function block(
  type: string,
  data: Record<string, unknown> = {},
  children?: NotionBlock[],
): NotionBlock {
  counter += 1;
  return {
    object: "block",
    id: `00000000-0000-0000-0000-${String(counter).padStart(12, "0")}`,
    type,
    has_children: Boolean(children?.length),
    [type]: data,
    ...(children ? { children } : {}),
  } as unknown as NotionBlock;
}

/** One rich text item. */
export function richText(
  text: string,
  opts: {
    href?: string;
    annotations?: Partial<RichTextItemResponse["annotations"]>;
  } = {},
): RichTextItemResponse {
  return {
    type: "text",
    text: { content: text, link: opts.href ? { url: opts.href } : null },
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
      ...opts.annotations,
    },
    plain_text: text,
    href: opts.href ?? null,
  } as RichTextItemResponse;
}

/** Renders a React node (async server components included) to HTML. */
export async function renderToHtml(node: ReactNode): Promise<string> {
  const { prelude } = await prerender(node);
  return new Response(prelude).text();
}
