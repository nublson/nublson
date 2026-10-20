import { unstable_cache } from "next/cache";
import type { BookmarkPreview } from "notionic";
import { fetchBookmarkPreview } from "notionic/fetch";

/** Titles and descriptions change more often than favicons; a day is fresh enough. */
const LINK_PREVIEW_REVALIDATE_SECONDS = 60 * 60 * 24;

/**
 * Cached preview per URL: `{ preview }`, or `{ preview: null }` when the page
 * has none, so "no preview" is a cached value too.
 */
const getLinkPreviewCached = unstable_cache(
  async (url: string): Promise<{ preview: BookmarkPreview | null }> => ({
    preview: await fetchBookmarkPreview(url),
  }),
  ["link-preview-v1"],
  { tags: ["link-previews"], revalidate: LINK_PREVIEW_REVALIDATE_SECONDS },
);

/**
 * Process-local memo in front of the data cache, as in `@/services/favicon`:
 * `revalidatePath` evicts entries created while rendering a path, so every
 * Notion edit would otherwise refetch every linked page.
 */
const previewMemo = new Map<string, Promise<BookmarkPreview | null>>();

/** Bounded so a long-lived server cannot grow this without limit. */
const PREVIEW_MEMO_MAX = 512;

/** The linked page's title, description and image, or null. Never throws. */
export function getLinkPreview(url: string): Promise<BookmarkPreview | null> {
  const memoized = previewMemo.get(url);
  if (memoized) return memoized;

  const lookup = getLinkPreviewCached(url).then(
    ({ preview }) => preview,
    () => {
      previewMemo.delete(url);
      return null;
    },
  );

  if (previewMemo.size >= PREVIEW_MEMO_MAX) previewMemo.clear();
  previewMemo.set(url, lookup);
  return lookup;
}
