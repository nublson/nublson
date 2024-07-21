import {
  formatBlockWithChildren,
  formatGears,
  formatPageProps,
  formatPosts,
} from "@/utils/formatter";
import { Client } from "@notionhq/client";
import { cache } from "react";

interface ApiResponse {
  posts: any[]; // Adjust based on the structure of your posts
  hasMore: boolean;
  // Add other properties based on your API response
}

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

export const getData = cache(
  async (
    databaseId: string,
    page: number,
    limit?: number
  ): Promise<ApiResponse> => {
    // Calculate the correct start_cursor for the given page
    let startId: string | undefined;
    for (let i = 1; i < page; i++) {
      const data = await api.databases.query({
        database_id: databaseId,
        page_size: limit,
        start_cursor: startId,
        filter: {
          and: [
            {
              property: "state",
              select: {
                equals: "published",
              },
            },
          ],
        },
        sorts: [
          {
            property: "publish_date",
            direction: "descending",
          },
        ],
      });
      startId = data.next_cursor as string | undefined;
      if (!data.has_more) break;
    }

    // Fetch the data for the current page
    const data = await api.databases.query({
      database_id: databaseId,
      page_size: limit,
      start_cursor: startId,
      filter: {
        and: [
          {
            property: "state",
            select: {
              equals: "published",
            },
          },
        ],
      },
      sorts: [
        {
          property: "publish_date",
          direction: "descending",
        },
      ],
    });

    return {
      posts: formatPosts(data.results),
      hasMore: data.has_more,
    };
  }
);

export const getGears = cache(async (databaseId: string) => {
  const { results } = await api.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "state",
          select: {
            equals: "published",
          },
        },
      ],
    },
    sorts: [
      {
        property: "category",
        direction: "ascending",
      },
      {
        property: "state",
        direction: "descending",
      },
      {
        property: "updated",
        direction: "ascending",
      },
    ],
  });

  return formatGears(results);
});

export const getPage = cache(async (pageId: string) => {
  const response = await api.pages.retrieve({ page_id: pageId });

  return formatPageProps(response);
});

export const getBlocks = cache(async (pageId: string) => {
  const response = await api.blocks.children.list({
    block_id: pageId,
  });

  const childBlocks = await Promise.all(
    response.results
      .filter((block: any) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        };
      })
  );

  const blocksWithChildren = formatBlockWithChildren(
    response.results,
    childBlocks
  );

  return blocksWithChildren;
});
