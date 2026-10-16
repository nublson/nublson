import { buildNotionImageProxyUrl } from "@/lib/notion-image";
import {
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client";
import slugify from "slugify";

/** File covers expire; proxy them. External covers stay as-is. */
function formatCoverThumbnail(
  page: PageObjectResponse,
): string | undefined {
  const cover = page.cover;
  if (!cover) return undefined;
  if (cover.type === "file") {
    return buildNotionImageProxyUrl({
      resource: "cover",
      id: page.id,
      v: page.last_edited_time,
    });
  }
  if (cover.type === "external") {
    return cover.external.url;
  }
  return undefined;
}

export type PostIcon =
  | { type: "emoji"; value: string }
  | { type: "image"; src: string };

/** Notion page icon. Uploaded files and custom emoji go through the proxy because their URLs expire. */
export function formatPageIcon(page: PageObjectResponse): PostIcon | undefined {
  const icon = page.icon;
  if (!icon) return undefined;
  switch (icon.type) {
    case "emoji":
      return { type: "emoji", value: icon.emoji };
    case "external":
      return { type: "image", src: icon.external.url };
    case "file":
    case "custom_emoji":
      return {
        type: "image",
        src: buildNotionImageProxyUrl({
          resource: "icon",
          id: page.id,
          v: page.last_edited_time,
        }),
      };
    default:
      return undefined;
  }
}

export const slugifyText = (text: string) => {
  return slugify(text, {
    remove: /[*+~.,()'"?!:@]/g,
    lower: true,
  });
};

/** A rich text property as Notion items, plus all segments as one clean line. */
function richTextProperty(
  page: PageObjectResponse,
  name: string,
): { items: RichTextItemResponse[]; plain: string } {
  const property = page.properties[name];
  const items = property?.type === "rich_text" ? property.rich_text : [];
  const plain = items
    .map((t) => t.plain_text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
  return { items, plain };
}

export type PageMetadata = {
  id: string;
  title: string;
  slug: string;
  /** Plain text of the whole description, for metadata and feeds. */
  description: string;
  /** The description as Notion rich text, for rendering links and emphasis. */
  descriptionRichText: RichTextItemResponse[];
  modified_date: string | undefined;
  thumbnail?: string;
  /** Set by `withThumbnailBlur`, not by the formatter; see `@/services/notion`. */
  blurDataURL?: string;
  role?: string;
  location?: string;
};

export const formatPageMetadata = (page: PageObjectResponse): PageMetadata => {
  const title =
    page.properties.Name.type === "title"
      ? (page.properties.Name.title[0]?.plain_text ?? "")
      : "";

  const thumbnail = formatCoverThumbnail(page);
  const { items: descriptionRichText, plain: description } = richTextProperty(
    page,
    "description",
  );

  return {
    id: page.id,
    title,
    slug: slugifyText(title),
    thumbnail,
    description,
    descriptionRichText,
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
  /** Set by `withThumbnailBlur`, not by the formatter; see `@/services/notion`. */
  blurDataURL?: string;
  icon?: PostIcon;
  /** Plain text of the whole description, for rows, feeds and metadata. */
  description: string;
  /** The description as Notion rich text, for the article lede. */
  descriptionRichText: RichTextItemResponse[];
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

    const thumbnail = formatCoverThumbnail(page);

    const { items: descriptionRichText, plain: description } =
      richTextProperty(page, "Description");

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
      icon: formatPageIcon(page),
      description,
      descriptionRichText,
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
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatPostDateFull = (date: string): string => {
  const parts = notionDateParts(date);
  if (!parts) return "";
  return `${MONTHS_SHORT[Number(parts.month) - 1]} ${Number(parts.day)}, ${parts.year}`;
};

/**
 * Calendar date parts read straight from the Notion string, so the
 * visitor's timezone can never move a post to another day.
 */
function notionDateParts(
  date: string,
): { year: string; month: string; day: string } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  return match ? { year: match[1], month: match[2], day: match[3] } : null;
}

/** e.g. "25/06" — archive rows, where the year is shown in its own column */
export const formatPostDayMonth = (date: string): string => {
  const parts = notionDateParts(date);
  return parts ? `${parts.day}/${parts.month}` : "";
};

/** e.g. "25/06" this year, "12/12/25" otherwise — short post lists */
export const formatPostDateCompact = (
  date: string,
  currentYear: number = new Date().getFullYear(),
): string => {
  const parts = notionDateParts(date);
  if (!parts) return "";
  const dayMonth = `${parts.day}/${parts.month}`;
  return Number(parts.year) === currentYear
    ? dayMonth
    : `${dayMonth}/${parts.year.slice(2)}`;
};

export type PostYearGroup = { year: string; posts: PostMetadata[] };

/** Groups already-sorted posts by publish year; undated posts get `year: ""`. */
export function groupPostsByYear(posts: PostMetadata[]): PostYearGroup[] {
  const groups: PostYearGroup[] = [];
  for (const post of posts) {
    const year = notionDateParts(post.published_date)?.year ?? "";
    const group = groups.find((g) => g.year === year);
    if (group) group.posts.push(post);
    else groups.push({ year, posts: [post] });
  }
  return groups;
}

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

const VIEW_PLURAL = new Intl.PluralRules("en-US");

/** "1 view", "20 views", "1.2K views" — a whole phrase, never assembled around a bare number. */
export function formatViewCount(views: number): string {
  const noun = VIEW_PLURAL.select(views) === "one" ? "view" : "views";
  return `${formatCompactCount(views)} ${noun}`;
}

