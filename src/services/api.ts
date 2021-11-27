import { Client } from "@notionhq/client";

const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});

export const getDatabase = async (databaseId: string) => {
  const { results } = await api.databases.query({
    database_id: databaseId,
    filter: {
      or: [
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
