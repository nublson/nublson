import React from "react";
import type {
  ListTextPartLike,
  NotionRichTextElementProps,
  RichTextAnnotationsLike,
} from "./types";

export function isNotionRichTextElementProps(
  value: unknown,
): value is NotionRichTextElementProps {
  if (value == null || typeof value !== "object") {
    return false;
  }
  const plain = (value as { plain_text?: unknown }).plain_text;
  return typeof plain === "string";
}

export function applyTextDecorations(
  content: React.ReactNode,
  annotations?: RichTextAnnotationsLike,
): React.ReactNode {
  if (annotations == null) {
    return content;
  }

  let decorated = content;

  if (annotations.bold) {
    decorated = <strong>{decorated}</strong>;
  }
  if (annotations.italic) {
    decorated = <em>{decorated}</em>;
  }
  if (annotations.strikethrough) {
    decorated = <s>{decorated}</s>;
  }
  if (annotations.underline) {
    decorated = <u>{decorated}</u>;
  }
  if (annotations.code) {
    decorated = <code>{decorated}</code>;
  }

  return decorated;
}

type RichTextNodeInput = Pick<
  ListTextPartLike,
  "plain_text" | "href" | "text" | "annotations"
> & {
  children?: React.ReactNode;
};

export function renderRichTextNode(
  textLike: RichTextNodeInput,
  key?: string,
): React.ReactNode {
  const { plain_text, text, href, annotations, children } = textLike;
  const rawText =
    plain_text ??
    text?.content ??
    (typeof children === "string" ? children : "");
  const link = href ?? text?.link?.url;
  const styledText = applyTextDecorations(rawText, annotations);

  if (link == null || link === "") {
    return key != null ? (
      <React.Fragment key={key}>{styledText}</React.Fragment>
    ) : (
      styledText
    );
  }

  return (
    <a
      key={key}
      href={link}
      className="underline underline-offset-2 text-muted-foreground hover:text-accent-foreground transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rawText}
    >
      {styledText}
    </a>
  );
}

export function mapParagraphChildren(
  children: React.ReactNode,
): React.ReactNode[] {
  return (
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const props = child.props as unknown;
      if (!isNotionRichTextElementProps(props)) {
        return child;
      }

      return renderRichTextNode(props);
    }) ?? []
  );
}

export function mapListTextParts(parts: ListTextPartLike[]): React.ReactNode[] {
  return parts.map((part, index) =>
    renderRichTextNode(part, `list-part-${index}`),
  );
}
