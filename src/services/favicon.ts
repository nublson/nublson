import { resolveFavicon } from "@/lib/favicon";
import { unstable_cache } from "next/cache";

/** Favicons rarely change; a month keeps redesigns showing up eventually. */
const FAVICON_REVALIDATE_SECONDS = 60 * 60 * 24 * 30;

/** Same budget as page-block fetching and blur generation. */
const FAVICON_CONCURRENCY = 10;

/**
 * Cached favicon per hostname: `{ src }` with a data URL, or `{ src: null }`
 * when the site has none. Wrapped in an object so "no icon" is a cached value.
 *
 * Throws on a transient provider failure, so it is not written into the cache
 * and the next render retries.
 */
const getFaviconCached = unstable_cache(
  async (host: string): Promise<{ src: string | null }> => ({
    src: await withSlot(() => resolveFavicon(host)),
  }),
  ["favicon-v1"],
  { tags: ["favicons"], revalidate: FAVICON_REVALIDATE_SECONDS },
);

/**
 * Process-local memo in front of the data cache, for the same reason as
 * `thumbnailBlurMemo` in `@/services/notion`: `revalidatePath` in
 * `/api/revalidate` evicts entries created while rendering a path, so every
 * Notion edit would otherwise refetch every favicon on the page. It holds the
 * promise, so links to the same site in one render share one lookup.
 */
const faviconMemo = new Map<string, Promise<string | null>>();

/** Bounded so a long-lived server cannot grow this without limit. */
const FAVICON_MEMO_MAX = 512;

let activeLookups = 0;
const waiting: Array<() => void> = [];

/** Runs `task` once fewer than {@link FAVICON_CONCURRENCY} lookups are in flight. */
async function withSlot<T>(task: () => Promise<T>): Promise<T> {
  if (activeLookups >= FAVICON_CONCURRENCY) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  activeLookups++;
  try {
    return await task();
  } finally {
    activeLookups--;
    waiting.shift()?.();
  }
}

/**
 * The favicon for `host` as a data URL, or null to draw the globe instead.
 * Never throws: a failed lookup shows the globe now and retries next render.
 */
export function getFavicon(host: string): Promise<string | null> {
  const memoized = faviconMemo.get(host);
  if (memoized) return memoized;

  const lookup = getFaviconCached(host).then(
    ({ src }) => src,
    () => {
      // Forget failures so the next render asks again.
      faviconMemo.delete(host);
      return null;
    },
  );

  if (faviconMemo.size >= FAVICON_MEMO_MAX) faviconMemo.clear();
  faviconMemo.set(host, lookup);
  return lookup;
}
