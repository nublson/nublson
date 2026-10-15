import type { RichTextItemResponse } from "@notionhq/client";
import type { ReactNode } from "react";
import { notionLinkAttributes } from "./content-blocks/link-attributes";
import { renderRichTextNode } from "./content-blocks/rich-text";
import { Typography, type TypographySize } from "./typography";

/**
 * Splits rich text into paragraphs at blank lines. A segment can hold several
 * paragraphs, so each one is cut into pieces that keep its link and styles.
 */
function toParagraphs(items: RichTextItemResponse[]): RichTextItemResponse[][] {
  const paragraphs: RichTextItemResponse[][] = [[]];
  for (const item of items) {
    item.plain_text.split(/\n{2,}/).forEach((piece, i) => {
      if (i > 0) paragraphs.push([]);
      if (piece) paragraphs[paragraphs.length - 1].push({ ...item, plain_text: piece });
    });
  }
  return paragraphs.filter((p) => p.length > 0);
}

/** A Notion page description rendered with its links, emphasis and paragraphs. */
export function RichDescription({
  items,
  size = "regular",
  className,
}: {
  items: RichTextItemResponse[];
  size?: TypographySize;
  className?: string;
}) {
  const paragraphs = toParagraphs(items);
  if (paragraphs.length === 0) return null;

  return paragraphs.map((paragraph, p) => (
    <Typography
      key={p}
      size={size}
      className={className ? `whitespace-pre-line ${className}` : "whitespace-pre-line"}
    >
      {paragraph.map(
        (item, i): ReactNode =>
          renderRichTextNode(
            {
              plain_text: item.plain_text,
              href: item.href ?? undefined,
              annotations: item.annotations,
            },
            notionLinkAttributes,
            `${p}-${i}`,
          ),
      )}
    </Typography>
  ));
}
