import type { RichTextItemResponse } from "@notionhq/client";

/** Whether rich text has anything to show; Notion keeps empty blocks around. */
export function hasText(text: RichTextItemResponse[]): boolean {
  return text.some((item) => item.plain_text.trim() !== "");
}

/** Rich text as one string, segments joined as written. */
export function plainText(text: RichTextItemResponse[]): string {
  return text.map((item) => item.plain_text).join("");
}
