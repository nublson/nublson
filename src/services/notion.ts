import {
  formatBlockWithChildren,
  formatGears,
  formatPageProps,
  formatPosts,
  formatVideos,
} from "@/utils/formatter";
import { Client } from "@notionhq/client";

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

export const getData = async (databaseId: string) => {
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
        property: "publish_date",
        direction: "descending",
      },
    ],
  });

  return formatPosts(results);
};

export const getVideos = async (databaseId: string) => {
  const { results } = await api.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: "state",
          select: {
            equals: "Published",
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

  return formatVideos(results);
};

export const getGears = async (databaseId: string) => {
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
        property: "Created",
        direction: "ascending",
      },
    ],
  });

  return formatGears(results);
};

export const getPage = async (pageId: string) => {
  const response = await api.pages.retrieve({ page_id: pageId });

  return formatPageProps(response);
};

export const getBlocks = async (pageId: string) => {
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
};
