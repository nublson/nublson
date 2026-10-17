import { FaviconLink } from "@/components/favicon-link";
import { SiteFavicon } from "@/components/site-favicon";
import { findSocialProfile } from "@/utils/social-profiles";
import React from "react";
import type { RichTextItemResponse } from "@notionhq/client";
import { notionLinkAttributes } from "./link-attributes";
import type { ListTextPartLike, RichTextAnnotationsLike } from "./types";

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

/**
 * `inherit` drops the muted default colour, for text whose container already
 * sets one (headings, callouts, quotes, table cells).
 */
export type DefaultTextColor = "muted" | "inherit";

export function applyTextDecorations(
  content: React.ReactNode,
  annotations?: RichTextAnnotationsLike,
  defaultColor: DefaultTextColor = "muted",
): React.ReactNode {
  const colorKey = annotations?.color ?? "default";
  const defaultClass =
    defaultColor === "inherit" ? undefined : NOTION_COLOR_CLASSES.default;
  const colorClass =
    annotations?.code && colorKey === "default"
      ? "text-accent-foreground"
      : colorKey === "default"
        ? defaultClass
        : (NOTION_COLOR_CLASSES[colorKey] ?? defaultClass);

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
        className={`font-mono text-[0.875em] bg-muted px-1.5 py-0.5 rounded-sm ${cls ?? "text-accent-foreground"}`}
      >
        {c}
      </code>
    ));

  if (wrappers.length === 0) {
    return colorClass ? <span className={colorClass}>{content}</span> : content;
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
  defaultColor?: DefaultTextColor,
): React.ReactNode {
  const { plain_text, text, href, annotations, children } = textLike;
  const rawText =
    plain_text ??
    text?.content ??
    (typeof children === "string" ? children : "");
  const link = href ?? text?.link?.url;
  const styledText = applyTextDecorations(rawText, annotations, defaultColor);

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

  const profile = findSocialProfile(link);
  if (profile) {
    return (
      <FaviconLink
        key={key}
        href={link}
        label={profile.label}
        target={resolvedLinkAttributes?.target ?? "_blank"}
        rel={resolvedLinkAttributes?.rel ?? "noopener noreferrer"}
      >
        {styledText}
      </FaviconLink>
    );
  }

  return (
    <a
      key={key}
      href={link}
      className="text-foreground underline decoration-input underline-offset-[3px] transition-colors duration-150 ease-(--ease-out) hover:decoration-foreground"
      target={resolvedLinkAttributes?.target ?? "_blank"}
      rel={resolvedLinkAttributes?.rel}
      aria-label={rawText}
    >
      <SiteFavicon href={link} />
      {styledText}
    </a>
  );
}

/** A Notion rich text array, with this site's link and colour styling. */
export function RichText({
  text,
  defaultColor,
}: {
  text: RichTextItemResponse[];
  defaultColor?: DefaultTextColor;
}) {
  return text.map((item, i) =>
    renderRichTextNode(
      {
        plain_text: item.plain_text,
        href: item.href ?? undefined,
        annotations: item.annotations,
      },
      notionLinkAttributes,
      String(i),
      defaultColor,
    ),
  );
}
