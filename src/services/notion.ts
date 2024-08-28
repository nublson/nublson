import {
  formatBlockWithChildren,
  formatGears,
  formatPageProps,
  formatPosts,
} from "@/utils/formatter";
import { Client } from "@notionhq/client";
import { doesNotMatch } from "assert";
import { cache } from "react";

interface ApiResponse {
  posts: any[]; // Adjust based on the structure of your posts
  hasMore: boolean;
  // Add other properties based on your API response
}

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

const fetchPageData = async (
  databaseId: string,
  media: string,
  startCursor: string | undefined,
  limit?: number,
  type?: "products" | "resources"
) => {
  try {
    const filters = [
      {
        property: "Media",
        select: {
          equals: media,
        },
      },
      {
        property: "State",
        select:
          process.env.NODE_ENV === "development"
            ? {
                does_not_equal: "To Do",
              }
            : {
                equals: "Done",
              },
      },
    ];

    if (type) {
      filters.push({
        property: "Type",
        select: {
          equals: type,
        },
      });
    }

    const response = await api.databases.query({
      database_id: databaseId,
      page_size: limit,
      start_cursor: startCursor,
      filter: {
        and: filters,
      },
      sorts: [
        {
          property: "Publish Date",
          direction: "descending",
        },
      ],
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getData = cache(
  async (
    databaseId: string,
    media: "Youtube" | "Blog" | "Store" | "Newsletter",
    page: number,
    limit?: number,
    type?: "products" | "resources"
  ): Promise<ApiResponse> => {
    let startCursor: string | undefined;

    for (let i = 1; i < page; i++) {
      const data = await fetchPageData(
        databaseId,
        media,
        startCursor,
        limit,
        type
      );
      startCursor = data.next_cursor as string | undefined;
      if (!data.has_more) break;
    }

    if (!startCursor && page > 1) {
      return {
        posts: [],
        hasMore: false,
      };
    }

    const data = await fetchPageData(
      databaseId,
      media,
      startCursor,
      limit,
      type
    );

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

  const childBlocks: { id: string; children: any[] }[] = await Promise.all(
    response.results
      .filter((block: any) => block.has_children)
      .map(async (block) => ({
        id: block.id,
        children: await getBlocks(block.id),
      }))
  );

  return formatBlockWithChildren(response.results, childBlocks);
});
