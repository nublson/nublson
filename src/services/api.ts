import { Client } from "@notionhq/client";

export const api = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
});
