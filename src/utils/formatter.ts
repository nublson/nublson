import { BlockWithChildren } from "@/services/notion";
import { BlockObjectResponse, PageObjectResponse } from "@notionhq/client";
import slugify from "slugify";

export const slugifyText = (text: string) => {
  return slugify(text, {
    remove: /[*+~.,()'"?!:@]/g,
    lower: true,
  });
};

export type PageMetadata = {
  id: string;
  title: string;
  slug: string;
  description: string;
  modified_date: string | undefined;
  thumbnail?: string;
  role?: string;
  location?: string;
};

export const formatPageMetadata = (page: PageObjectResponse): PageMetadata => {
  const cover = page.cover;

  const title =
    page.properties.Name.type === "title"
      ? (page.properties.Name.title[0]?.plain_text ?? "")
      : "";

  const thumbnail = cover
    ? cover.type === "file"
      ? cover.file.url
      : cover.external.url
    : undefined;

  return {
    id: page.id,
    title,
    slug: slugifyText(title),
    thumbnail,
    description:
      page.properties.description?.type === "rich_text"
        ? (page.properties.description.rich_text[0]?.plain_text ?? "")
        : "",
    modified_date:
      page.properties.modified_date?.type === "last_edited_time"
        ? page.properties.modified_date.last_edited_time
        : undefined,
    role:
      page.properties.role?.type === "rich_text"
        ? (page.properties.role.rich_text[0]?.plain_text ?? "")
        : undefined,
    location:
      page.properties.location?.type === "rich_text"
        ? (page.properties.location.rich_text[0]?.plain_text ?? "")
        : undefined,
  };
};

export type PostMetadata = {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  description: string;
  published_date: string;
  updated_date: string;
  path: string;
  source: string;
  category: string;
  author: string;
};

export const formatPostMetadata = (
  databasePages: PageObjectResponse[],
): PostMetadata[] => {
  return databasePages.map((page) => {
    const title =
      page.properties.Name.type === "title"
        ? (page.properties.Name.title[0]?.plain_text ?? "")
        : "";

    const cover = page.cover;
    const thumbnail =
      cover?.type === "file"
        ? cover.file.url
        : cover?.type === "external"
          ? cover.external.url
          : undefined;

    const description =
      page.properties.Description.type === "rich_text"
        ? (page.properties.Description.rich_text[0]?.plain_text ?? "")
        : "";

    const published_date =
      page.properties["Publish Date"]?.type === "date"
        ? (page.properties["Publish Date"].date?.start ?? "")
        : "";

    const updated_date = page.last_edited_time;
    const path =
      page.properties.Path?.type === "url"
        ? (page.properties.Path.url ?? "")
        : "";
    const source =
      page.properties.Source?.type === "url"
        ? (page.properties.Source.url ?? "")
        : "";
    const category =
      page.properties.Category?.type === "select"
        ? (page.properties.Category.select?.name ?? "")
        : "";
    const author =
      page.properties.Author?.type === "people"
        ? (() => {
            const firstAuthor = page.properties.Author.people[0];
            return firstAuthor && "name" in firstAuthor
              ? (firstAuthor.name ?? "")
              : "";
          })()
        : "";
    return {
      id: page.id,
      title,
      slug: slugifyText(title),
      thumbnail,
      description,
      published_date,
      updated_date,
      path,
      source,
      category,
      author,
    };
  });
};

export const formatPostDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

/** Normalizes Notion date/date-time strings into ISO 8601 with timezone. */
export const formatDateTimeIso = (date: string) => {
  if (!date) return date;

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return `${date}T00:00:00Z`;
  }

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toISOString();
};

/** e.g. "Sep 19, 2025" — for article / project detail headers */
export const formatPostDateFull = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Compacts a non-negative count for UI (e.g. reactions).
 * Examples: `999` → `"999"`, `1000` → `"1K"`, `10300` → `"10.3K"`, `999_999` → `"1M"`.
 */
export function formatCompactCount(value: number): string {
  const n = Math.trunc(Number(value));
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n < 1000) return String(n);

  const withSuffix = (divisor: number, suffix: string): string => {
    const x = n / divisor;
    const rounded = Math.round(x * 10) / 10;
    const body = Number.isInteger(rounded)
      ? String(rounded)
      : `${rounded.toFixed(1).replace(/\.0$/, "")}`;
    return `${body}${suffix}`;
  };

  if (n < 1_000_000) {
    const roundedK = Math.round((n / 1000) * 10) / 10;
    if (roundedK >= 1000) {
      return withSuffix(1_000_000, "M");
    }
    return withSuffix(1000, "K");
  }

  return withSuffix(1_000_000, "M");
}

export const formatBlockWithChildren = (
  blocks: BlockWithChildren[],
): BlockWithChildren[] => {
  return blocks.map((block) => {
    if (!block.has_children || !block.children) return block;

    return {
      ...block,
      [block.type]: {
        ...(block[block.type as keyof BlockObjectResponse] as object),
        children: block.children,
      },
    };
  });
};

/**
 * Block shape that may represent a bullet list: either grouped items (render lib)
 * or a single Notion bulleted_list_item block.
 */
type ListBlockLike =
  | { items?: Array<{ content?: { text?: Array<{ plain_text?: string }> } }> }
  | { bulleted_list_item?: { rich_text?: Array<{ plain_text?: string }> } };

/**
 * Extracts list item strings from a bullet-list block.
 * Supports both Notion API shape (bulleted_list_item.rich_text) and
 * render lib shape (items[].content.text[].plain_text).
 *
 * @param block - A bullet list block (single bulleted_list_item or grouped items).
 * @returns Array of plain text strings, one per item.
 */
export function getListBlockItems(block: ListBlockLike): string[] {
  if ("items" in block && Array.isArray(block.items)) {
    return block.items.map((item) =>
      (item.content?.text ?? [])
        .map((textPart) => textPart.plain_text ?? "")
        .join(""),
    );
  }
  if (
    "bulleted_list_item" in block &&
    block.bulleted_list_item?.rich_text &&
    Array.isArray(block.bulleted_list_item.rich_text)
  ) {
    const text = block.bulleted_list_item.rich_text
      .map((t) => t.plain_text ?? "")
      .join("");
    return text ? [text] : [];
  }
  return [];
}
