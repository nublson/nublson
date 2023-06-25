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

  return results;
};

export const getPage = async (pageId: string) => {
  const response = await api.pages.retrieve({ page_id: pageId });
  return response;
};

export const getBlocks = async (blockId: string) => {
  const response = await api.blocks.children.list({
    block_id: blockId,
  });
  return response.results;
};
