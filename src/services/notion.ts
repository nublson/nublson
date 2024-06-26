import {
  formatBlockWithChildren,
  formatGears,
  formatPageProps,
  formatPosts,
} from "@/utils/formatter";
import { Client } from "@notionhq/client";
import { cache } from "react";

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

export const getData = cache(async (databaseId: string) => {
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
});

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
