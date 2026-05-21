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

const NOTION_COLOR_CLASSES: Record<string, string> = {
  default: "text-muted-foreground",
  gray: "text-gray-500",
  brown: "text-amber-800 dark:text-amber-600",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
  green: "text-green-600",
  blue: "text-blue-500",
  purple: "text-purple-500",
  pink: "text-pink-500",
  red: "text-red-500",
  gray_background: "bg-gray-200 dark:bg-gray-700",
  brown_background: "bg-amber-100 dark:bg-amber-900",
  orange_background: "bg-orange-100 dark:bg-orange-900",
  yellow_background: "bg-yellow-100 dark:bg-yellow-900",
  green_background: "bg-green-100 dark:bg-green-900",
  blue_background: "bg-blue-100 dark:bg-blue-900",
  purple_background: "bg-purple-100 dark:bg-purple-900",
  pink_background: "bg-pink-100 dark:bg-pink-900",
  red_background: "bg-red-100 dark:bg-red-900",
};

export function applyTextDecorations(
  content: React.ReactNode,
  annotations?: RichTextAnnotationsLike,
): React.ReactNode {
  const colorClass =
    NOTION_COLOR_CLASSES[annotations?.color ?? "default"] ??
    "text-muted-foreground";

  type Wrap = (
    inner: React.ReactNode,
    cls: string | undefined,
  ) => React.ReactNode;

  const wrappers: Wrap[] = [];

  if (annotations?.bold)
    wrappers.push((c, cls) => <strong className={cls}>{c}</strong>);
  if (annotations?.italic)
    wrappers.push((c, cls) => <em className={cls}>{c}</em>);
  if (annotations?.strikethrough)
    wrappers.push((c, cls) => <s className={cls}>{c}</s>);
  if (annotations?.underline)
    wrappers.push((c, cls) => <u className={cls}>{c}</u>);
  if (annotations?.code)
    wrappers.push((c, cls) => (
      <code
        className={`font-mono text-[0.875em] bg-muted px-1.5 py-0.5 rounded-sm ${cls ?? "text-muted-foreground"}`}
      >
        {c}
      </code>
    ));

  if (wrappers.length === 0) {
    return <span className={colorClass}>{content}</span>;
  }

  let decorated = content;
  for (let i = 0; i < wrappers.length - 1; i++) {
    decorated = wrappers[i](decorated, undefined);
  }
  decorated = wrappers[wrappers.length - 1](decorated, colorClass);

  return decorated;
}

type RichTextNodeInput = Pick<
  ListTextPartLike,
  "plain_text" | "href" | "text" | "annotations"
> & {
  children?: React.ReactNode;
};

type LinkAttributesLike = {
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export function renderRichTextNode(
  textLike: RichTextNodeInput,
  linkAttributes?: (url: string) => LinkAttributesLike,
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

  const isHttp = link.startsWith("http://") || link.startsWith("https://");
  const resolvedLinkAttributes = linkAttributes?.(link);

  if (!isHttp) {
    return null;
  }

  return (
    <a
      key={key}
      href={link}
      className="underline underline-offset-2 text-muted-foreground hover:text-accent-foreground transition-all duration-300"
      target={resolvedLinkAttributes?.target ?? "_blank"}
      rel={resolvedLinkAttributes?.rel}
      aria-label={rawText}
    >
      {styledText}
    </a>
  );
}

export function mapParagraphChildren(
  children: React.ReactNode,
  linkAttributes?: (url: string) => LinkAttributesLike,
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

      return renderRichTextNode(props, linkAttributes);
    }) ?? []
  );
}

export function mapListTextParts(parts: ListTextPartLike[]): React.ReactNode[] {
  return parts.map((part, index) =>
    renderRichTextNode(part, undefined, `list-part-${index}`),
  );
}
