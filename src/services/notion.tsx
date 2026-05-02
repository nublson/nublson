import { formatBlockWithChildren } from "@/utils/formatter";
import {
  BlockObjectResponse,
  Client,
  isFullBlock,
  isFullPage,
} from "@notionhq/client";
import { cache } from "react";

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

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
  const filters = [
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
  ];

  try {
    const response = await api.dataSources.query({
      data_source_id: databaseId,
      filter: {
        and: filters,
      },
      filter_properties: ["title", "Description", "Publish Date"],
      sorts: [
        {
          property: "Publish Date",
          direction: "descending",
        },
      ],
      page_size: limit,
    });

    return response.results.filter(isFullPage);
  } catch (error) {
    throw error;
  }
};

const mediaMap = {
  Blog: "Blog",
  Project: "Project",
} as const;

export const getDatabasePages = cache(
  async (databaseId: string, media: keyof typeof mediaMap, limit?: number) => {
    return fetchDatabasePages(databaseId, mediaMap[media], limit);
  },
);

export type BlockWithChildren = BlockObjectResponse & {
  children?: BlockWithChildren[];
};

export const getPageBlocks = cache(
  async (pageId: string): Promise<BlockWithChildren[]> => {
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

    const blocksWithChildren = await Promise.all(
      blocks.map(async (block) => {
        if (!block.has_children) return block;

        return {
          ...block,
          children: await getPageBlocks(block.id),
        };
      }),
    );

    return formatBlockWithChildren(blocksWithChildren);
  },
);
