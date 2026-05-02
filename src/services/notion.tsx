import { mapPool } from "@/lib/map-pool";
import { formatBlockWithChildren, formatPostMetadata } from "@/utils/formatter";
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

const mediaMap = {
  Blog: "Blog",
  Project: "Project",
} as const;

const publishedBaseFilters = (media: string) =>
  [
    {
      property: "Media",
      select: {
        equals: media,
      },
    },
    {
      property: "State",
      select: {
        equals: "Done",
      },
    },
  ] as const;

async function queryPublishedPagesPage(
  databaseId: string,
  media: string,
  options: {
    pageSize: number;
    start_cursor?: string;
    /** Narrow results (e.g. optional Notion `Slug` rich_text property). */
    extraAnd?: unknown[];
  },
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
    filter_properties: ["title", "Description", "Publish Date"],
    sorts: [
      {
        property: "Publish Date",
        direction: "descending",
      },
    ],
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
  media: string,
  limit?: number,
) => {
  const pageSize = Math.min(limit ?? QUERY_PAGE_SIZE, QUERY_PAGE_SIZE);
  const { pages } = await queryPublishedPagesPage(databaseId, media, {
    pageSize,
  });
  return pages;
};

export const getDatabasePages = cache(
  async (databaseId: string, media: keyof typeof mediaMap, limit?: number) => {
    return fetchDatabasePages(databaseId, mediaMap[media], limit);
  },
);

/**
 * All published rows for static params (paginates past the first 100).
 * @see getDatabasePageBySlug — same pagination for runtime slug resolution.
 */
export async function getAllPublishedSlugsForStaticParams(
  databaseId: string,
  media: keyof typeof mediaMap,
): Promise<{ slug: string }[]> {
  const out: { slug: string }[] = [];
  let cursor: string | undefined;
  do {
    const { pages, next_cursor } = await queryPublishedPagesPage(
      databaseId,
      mediaMap[media],
      { pageSize: QUERY_PAGE_SIZE, start_cursor: cursor },
    );
    out.push(...formatPostMetadata(pages).map((p) => ({ slug: p.slug })));
    cursor = next_cursor;
  } while (cursor);
  return out;
}

/** Resolves a published database row by URL slug (derived from the page title). */
export const getDatabasePageBySlug = cache(
  async (
    databaseId: string,
    media: keyof typeof mediaMap,
    slug: string,
  ) => {
    const slugProperty = process.env.NOTION_SLUG_PROPERTY?.trim();
    if (slugProperty) {
      try {
        const { pages } = await queryPublishedPagesPage(
          databaseId,
          mediaMap[media],
          {
            pageSize: 10,
            extraAnd: [
              {
                property: slugProperty,
                rich_text: { equals: slug },
              },
            ],
          },
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
        mediaMap[media],
        { pageSize: QUERY_PAGE_SIZE, start_cursor: cursor },
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

  return formatBlockWithChildren(blocksWithChildren);
}

const fetchPageBlocksCached = unstable_cache(
  async (pageId: string) =>
    fetchBlocksRecursive(pageId, MAX_BLOCK_DEPTH),
  ["notion-page-blocks"],
  { tags: ["notion-blocks"], revalidate: 3600 },
);

export const getPageBlocks = cache(fetchPageBlocksCached);
