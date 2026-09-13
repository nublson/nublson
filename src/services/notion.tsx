import {
  FALLBACK_BLUR_DATA_URL,
  generateBlurDataUrl,
} from "@/lib/blur-placeholder";
import { mapPool } from "@/lib/map-pool";
import {
  buildNotionImageProxyUrl,
  parseNotionImageProxyUrl,
  toAbsoluteAssetUrl,
  type NotionImageResource,
} from "@/lib/notion-image";
import {
  formatBlockWithChildren,
  formatPostMetadata,
  type PostMetadata,
} from "@/utils/formatter";
import {
  BlockObjectResponse,
  Client,
  isFullBlock,
  isFullPage,
  type PageObjectResponse,
} from "@notionhq/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

/** Max concurrent child-block fetches per level (Notion rate limits). */
const PAGE_BLOCKS_FETCH_CONCURRENCY = 10;

/** Max nesting depth when resolving block children (avoids huge trees). */
const MAX_BLOCK_DEPTH = 5;

const QUERY_PAGE_SIZE = 100;

const defaultPostFilterProperties: string[] = [
  "title",
  "Description",
  "Publish Date",
  "Path",
  "Source",
  "Category",
  "Author",
];

const mediaMap = {
  Blog: "Blog",
  Project: "Project",
} as const;

export type PublishedPageSort = {
  property: string;
  direction: "ascending" | "descending";
};

const defaultPublishedPageSorts: PublishedPageSort[] = [
  {
    property: "Publish Date",
    direction: "descending",
  },
];

const publishedBaseFilters = (media?: string) => {
  const filters = [
    {
      property: "State",
      select: {
        equals: "Done",
      },
    },
  ];

  if (media) {
    filters.unshift({
      property: "Media",
      select: {
        equals: media,
      },
    });
  }

  return filters;
};

async function queryPublishedPagesPage(
  databaseId: string,
  options: {
    pageSize: number;
    start_cursor?: string;
    /** Narrow results (e.g. optional Notion `Slug` rich_text property). */
    extraAnd?: unknown[];
    sorts?: PublishedPageSort[];
    filterProperties?: string[];
  },
  media?: string,
): Promise<{
  pages: PageObjectResponse[];
  next_cursor: string | undefined;
}> {
  const andFilters = [
    ...publishedBaseFilters(media),
    ...(options.extraAnd ?? []),
  ];

  const response = await api.dataSources.query({
    data_source_id: databaseId,
    filter: {
      and: andFilters as never,
    },
    filter_properties: options.filterProperties ?? defaultPostFilterProperties,
    sorts: options.sorts ?? defaultPublishedPageSorts,
    page_size: options.pageSize,
    start_cursor: options.start_cursor,
  });

  return {
    pages: response.results.filter(isFullPage),
    next_cursor: response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined,
  };
}

export const getPageData = cache(async (pageId: string) => {
  const response = await api.pages.retrieve({ page_id: pageId });

  if (!isFullPage(response)) {
    throw new Error(`Page ${pageId} is not a full page response`);
  }

  return response;
});

const fetchDatabasePages = async (
  databaseId: string,
  media?: string,
  limit?: number,
  sorts?: PublishedPageSort[],
  filterProperties?: string[],
) => {
  const pageSize = Math.min(limit ?? QUERY_PAGE_SIZE, QUERY_PAGE_SIZE);
  const { pages } = await queryPublishedPagesPage(
    databaseId,
    { pageSize, sorts, filterProperties },
    media,
  );
  return pages;
};

export const getDatabasePages = cache(
  async (
    databaseId: string,
    media?: keyof typeof mediaMap,
    limit?: number,
    sorts?: PublishedPageSort[],
    filterProperties?: string[],
  ) => {
    return fetchDatabasePages(
      databaseId,
      media ? mediaMap[media] : undefined,
      limit,
      sorts,
      filterProperties,
    );
  },
);

export type PublishedSitemapEntry = {
  slug: string;
  lastModified: Date;
};

/**
 * All published rows with Notion `last_edited_time` (paginates past the first 100).
 * @see getDatabasePageBySlug — same pagination for runtime slug resolution.
 */
async function getAllPublishedEntriesWithTimestamps(
  databaseId: string,
  media: keyof typeof mediaMap,
): Promise<PublishedSitemapEntry[]> {
  const out: PublishedSitemapEntry[] = [];
  let cursor: string | undefined;
  do {
    const { pages, next_cursor } = await queryPublishedPagesPage(
      databaseId,
      { pageSize: QUERY_PAGE_SIZE, start_cursor: cursor },
      mediaMap[media],
    );
    const metadataList = formatPostMetadata(pages);
    for (let i = 0; i < pages.length; i++) {
      out.push({
        slug: metadataList[i]!.slug,
        lastModified: new Date(pages[i]!.last_edited_time),
      });
    }
    cursor = next_cursor;
  } while (cursor);
  return out;
}

/**
 * All published rows for static params (paginates past the first 100).
 * @see getDatabasePageBySlug — same pagination for runtime slug resolution.
 */
export async function getAllPublishedSlugsForStaticParams(
  databaseId: string,
  media: keyof typeof mediaMap,
): Promise<{ slug: string }[]> {
  const entries = await getAllPublishedEntriesWithTimestamps(databaseId, media);
  const uniqueSlugs = new Set<string>();
  const duplicateSlugs = new Set<string>();

  for (const { slug } of entries) {
    if (uniqueSlugs.has(slug)) {
      duplicateSlugs.add(slug);
      continue;
    }
    uniqueSlugs.add(slug);
  }

  if (duplicateSlugs.size > 0) {
    console.warn(
      `[notion] Duplicate slugs found in "${media}" static params for database ${databaseId}: ${Array.from(duplicateSlugs).join(", ")}`,
    );
  }

  return Array.from(uniqueSlugs, (slug) => ({ slug }));
}

/** Same pages as static params, including `lastModified` from Notion for sitemaps. */
export function getAllPublishedEntriesForSitemap(
  databaseId: string,
  media: keyof typeof mediaMap,
): Promise<PublishedSitemapEntry[]> {
  return getAllPublishedEntriesWithTimestamps(databaseId, media);
}

/**
 * All published posts for RSS (paginates past the first 100), newest first.
 * @see getAllPublishedEntriesWithTimestamps — same query and ordering.
 */
export async function getAllPublishedPostsForFeed(
  databaseId: string,
  media: keyof typeof mediaMap,
): Promise<PostMetadata[]> {
  const out: PostMetadata[] = [];
  let cursor: string | undefined;
  do {
    const { pages, next_cursor } = await queryPublishedPagesPage(
      databaseId,
      { pageSize: QUERY_PAGE_SIZE, start_cursor: cursor },
      mediaMap[media],
    );
    out.push(...formatPostMetadata(pages));
    cursor = next_cursor;
  } while (cursor);
  return out;
}

/** `NOTION_PAGE_ABOUT_ID` last edit time when configured and retrievable. */
export async function getAboutPageLastModified(): Promise<Date | null> {
  const id = process.env.NOTION_PAGE_ABOUT_ID?.trim();
  if (!id) return null;
  try {
    const page = await getPageData(id);
    return new Date(page.last_edited_time);
  } catch {
    return null;
  }
}

/** Resolves a published database row by URL slug (derived from the page title). */
export const getDatabasePageBySlug = cache(
  async (databaseId: string, media: keyof typeof mediaMap, slug: string) => {
    const slugProperty = process.env.NOTION_SLUG_PROPERTY?.trim();
    if (slugProperty) {
      try {
        const { pages } = await queryPublishedPagesPage(
          databaseId,
          {
            pageSize: 10,
            extraAnd: [
              {
                property: slugProperty,
                rich_text: { equals: slug },
              },
            ],
          },
          mediaMap[media],
        );
        if (pages.length > 0) {
          const metadataList = formatPostMetadata(pages);
          const index = metadataList.findIndex((m) => m.slug === slug);
          if (index !== -1) {
            return {
              page: pages[index]!,
              metadata: metadataList[index]!,
            };
          }
        }
      } catch {
        /* wrong property name or type — fall back to scan */
      }
    }

    let cursor: string | undefined;
    do {
      const { pages, next_cursor } = await queryPublishedPagesPage(
        databaseId,
        { pageSize: QUERY_PAGE_SIZE, start_cursor: cursor },
        mediaMap[media],
      );
      const metadataList = formatPostMetadata(pages);
      const index = metadataList.findIndex((m) => m.slug === slug);
      if (index !== -1) {
        return {
          page: pages[index]!,
          metadata: metadataList[index]!,
        };
      }
      cursor = next_cursor;
    } while (cursor);

    return null;
  },
);

export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

/**
 * Replaces Notion `file` image URLs (expiring signed links) with stable
 * `/api/notion-image` URLs. External images are left unchanged.
 */
function rewriteExpiringNotionImageUrls(
  blocks: BlockWithChildren[],
): BlockWithChildren[] {
  return blocks.map((block) => {
    let next: BlockWithChildren = block;

    if (block.type === "image") {
      const image = block.image;
      if (image.type === "file") {
        next = {
          ...block,
          image: {
            ...image,
            file: {
              ...image.file,
              url: buildNotionImageProxyUrl({
                resource: "block",
                id: block.id,
                v: block.last_edited_time,
              }),
            },
          },
        };
      }
    }

    if (next.children?.length) {
      next = {
        ...next,
        children: rewriteExpiringNotionImageUrls(next.children),
      };
    }

    return next;
  });
}

/** Fresh upstream URL for a page cover or image block (Notion signed URL). */
export async function resolveNotionImageUpstream(
  resource: NotionImageResource,
  id: string,
): Promise<{ url: string }> {
  if (resource === "cover") {
    const page = await api.pages.retrieve({ page_id: id });
    if (!isFullPage(page) || !page.cover) {
      throw new Error(`Cover not found for page ${id}`);
    }
    const url =
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url;
    return { url };
  }

  const block = await api.blocks.retrieve({ block_id: id });
  if (!isFullBlock(block) || block.type !== "image") {
    throw new Error(`Image block not found: ${id}`);
  }
  const url =
    block.image.type === "file"
      ? block.image.file.url
      : block.image.external.url;
  return { url };
}

/** Max concurrent blur generations (same budget as child-block fetching). */
const THUMBNAIL_BLUR_CONCURRENCY = 10;

/**
 * Cached blur placeholder for one thumbnail URL.
 *
 * The `thumbnail` argument is the whole cache key, and proxy URLs already
 * embed `v=<last_edited_time>`, so entries are content-addressed and never
 * need time-based invalidation — hence `revalidate: false`.
 *
 * Tagged `notion-blur` rather than `notion-blocks` so nothing purges
 * placeholders by tag. That alone is not enough: Next also applies an
 * implicit path tag to entries created while rendering a path, so the
 * `revalidatePath` in `/api/revalidate` still evicts them — which is what
 * `thumbnailBlurMemo` below absorbs.
 *
 * Throws rather than returning a fallback so a transient timeout is not
 * written into a permanently-cached entry; the next regeneration retries.
 */
const getThumbnailBlurCached = unstable_cache(
  async (thumbnail: string): Promise<string> => {
    const proxy = parseNotionImageProxyUrl(thumbnail);
    const upstreamUrl = proxy
      ? (await resolveNotionImageUpstream(proxy.resource, proxy.id)).url
      : toAbsoluteAssetUrl(thumbnail);

    if (!upstreamUrl) {
      throw new Error(`Unresolvable thumbnail URL: ${thumbnail}`);
    }

    const blurDataUrl = await generateBlurDataUrl(upstreamUrl);
    if (!blurDataUrl) {
      throw new Error(`Blur generation failed for: ${thumbnail}`);
    }

    return blurDataUrl;
  },
  ["notion-thumbnail-blur"],
  { tags: ["notion-blur"], revalidate: false },
);

type ThumbnailBearing = { thumbnail?: string; blurDataURL?: string };

/**
 * Process-local memo sitting in front of the data cache.
 *
 * Next tags every data-cache entry created while rendering a path with an
 * implicit path tag, so the `revalidatePath("/", "layout")` in
 * `/api/revalidate` purges blur entries on every Notion edit even though they
 * carry their own `notion-blur` tag. Keys here are content-addressed, so a
 * blur can never go stale under its key and this memo can safely outlive that
 * purge — saving a full image download per cover on every content edit.
 */
const thumbnailBlurMemo = new Map<string, string>();

/** Bounded so a long-lived server cannot grow this without limit. */
const THUMBNAIL_BLUR_MEMO_MAX = 512;

/** Real placeholder when one can be produced, flat 1x1 PNG otherwise. */
export async function getThumbnailBlur(thumbnail: string): Promise<string> {
  const memoized = thumbnailBlurMemo.get(thumbnail);
  if (memoized) return memoized;

  try {
    const blurDataUrl = await getThumbnailBlurCached(thumbnail);
    if (thumbnailBlurMemo.size >= THUMBNAIL_BLUR_MEMO_MAX) {
      thumbnailBlurMemo.clear();
    }
    thumbnailBlurMemo.set(thumbnail, blurDataUrl);
    return blurDataUrl;
  } catch {
    return FALLBACK_BLUR_DATA_URL;
  }
}

/**
 * Attaches `blurDataURL` to metadata that renders a cover image.
 *
 * Call this only from components that actually render a `CoverImage`; feeds,
 * sitemaps, the markdown API and MCP tools read the same metadata but would
 * pay a full image download for a placeholder they never render.
 */
export async function withThumbnailBlur<T extends ThumbnailBearing>(
  item: T,
): Promise<T> {
  if (!item.thumbnail) return item;
  return { ...item, blurDataURL: await getThumbnailBlur(item.thumbnail) };
}

/** {@link withThumbnailBlur} over a list, bounded to avoid image-fetch spikes. */
export async function withThumbnailBlurs<T extends ThumbnailBearing>(
  items: readonly T[],
): Promise<T[]> {
  return mapPool(items, THUMBNAIL_BLUR_CONCURRENCY, withThumbnailBlur);
}

async function fetchBlocksRecursive(
  pageId: string,
  depth: number,
): Promise<BlockWithChildren[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await api.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(...response.results.filter(isFullBlock));

    cursor = response.has_more
      ? (response.next_cursor ?? undefined)
      : undefined;
  } while (cursor);

  const blocksWithChildren = await mapPool(
    blocks,
    PAGE_BLOCKS_FETCH_CONCURRENCY,
    async (block) => {
      if (!block.has_children || depth <= 0) return block;

      return {
        ...block,
        children: await fetchBlocksRecursive(block.id, depth - 1),
      };
    },
  );

  return formatBlockWithChildren(
    rewriteExpiringNotionImageUrls(blocksWithChildren),
  );
}

const fetchPageBlocksCached = unstable_cache(
  async (pageId: string) => fetchBlocksRecursive(pageId, MAX_BLOCK_DEPTH),
  ["notion-page-blocks"],
  { tags: ["notion-blocks"], revalidate: 10 },
);

export const getPageBlocks = cache(fetchPageBlocksCached);
