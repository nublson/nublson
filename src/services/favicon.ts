import { unstable_cache } from "next/cache";
import { fetchLinkFavicon } from "notionic/fetch";

/**
 * Favicons rarely change, but `fetchLinkFavicon` answers null for a provider
 * outage as well as for a site without an icon, so a day bounds how long a
 * missed lookup shows the globe.
 */
const FAVICON_REVALIDATE_SECONDS = 60 * 60 * 24;

/** Same budget as page-block fetching and blur generation. */
const FAVICON_CONCURRENCY = 10;

/**
 * Cached favicon per hostname: `{ src }` with a data URL, or `{ src: null }`
 * when the site has none. Wrapped in an object so "no icon" is a cached value.
 *
 * Every link favicon goes through here (page bodies, descriptions, the link
 * preview card), rather than `fetchBlocks`' `linkFavicons`, which doesn't
 * cache and would refetch every host each time the blocks revalidate. The
 * lookup is notionic's: with `siteIcons`, the icon the site declares for
 * itself (its SVG, the smallest PNG of 32px or more, or `/favicon.ico`), then
 * Google's favicon service, then DuckDuckGo's, whose stored copies can be
 * stale or re-encoded. `siteIcons` fetches URLs the linked sites choose;
 * notionic refuses private addresses, and on Vercel's functions there is
 * nothing private to reach.
 */
const getFaviconCached = unstable_cache(
  async (host: string): Promise<{ src: string | null }> => ({
    src: await withSlot(() => fetchLinkFavicon(host, { siteIcons: true })),
  }),
  ["favicon-v3"],
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
 * Never throws: a failed cache read shows the globe now and retries next render.
 */
export function getFavicon(host: string): Promise<string | null> {
  const memoized = faviconMemo.get(host);
  if (memoized) return memoized;

  const lookup = getFaviconCached(host).then(
    ({ src }) => {
      // A null answer may be a provider outage rather than a site without an
      // icon, so keep it out of the memo: the data cache's day, not the
      // process lifetime, bounds how long the globe shows. Links rendered
      // while the lookup was in flight still shared this one promise.
      if (src === null) faviconMemo.delete(host);
      return src;
    },
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
