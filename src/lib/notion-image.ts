/** Stable local proxy for Notion-hosted file URLs (signed S3 links expire ~1h). */

export type NotionImageResource = "cover" | "block";

export const NOTION_IMAGE_API_PATH = "/api/notion-image";

/** Notion page/block ids (with or without dashes). */
const NOTION_ID_RE =
  /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

export function isNotionId(value: string): boolean {
  return NOTION_ID_RE.test(value);
}

export function isNotionImageResource(
  value: string,
): value is NotionImageResource {
  return value === "cover" || value === "block";
}

/**
 * Builds a stable app-local image URL. `v` is only a cache-buster
 * (e.g. Notion `last_edited_time`); the API ignores it for resolution.
 */
export function buildNotionImageProxyUrl(options: {
  resource: NotionImageResource;
  id: string;
  v?: string;
}): string {
  const params = new URLSearchParams({
    resource: options.resource,
    id: options.id,
  });
  if (options.v) {
    params.set("v", options.v);
  }
  return `${NOTION_IMAGE_API_PATH}?${params.toString()}`;
}

/** Parse a proxy path (relative or absolute) back to resource + id. */
export function parseNotionImageProxyUrl(
  src: string,
): { resource: NotionImageResource; id: string } | null {
  try {
    const url = src.startsWith("http")
      ? new URL(src)
      : new URL(src, "http://local.invalid");
    if (url.pathname !== NOTION_IMAGE_API_PATH) return null;

    const resource = url.searchParams.get("resource") ?? "";
    const id = url.searchParams.get("id") ?? "";
    if (!isNotionImageResource(resource) || !isNotionId(id)) return null;
    return { resource, id };
  } catch {
    return null;
  }
}

/** Absolute URL for JSON-LD / server-side fetch when `src` is the proxy path. */
export function toAbsoluteAssetUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  if (!src.startsWith("/")) return src;

  const base = process.env.BASE_URL?.replace(/\/$/, "");
  return base ? `${base}${src}` : src;
}
