import { PageObjectResponse } from "@notionhq/client";

export type PageMetadata = {
  id: string;
  title: string;
  description: string;
  modified_date: string | undefined;
  thumbnail?: string;
  role?: string;
  location?: string;
};

export const formatPageMetadata = (page: PageObjectResponse): PageMetadata => {
  const cover = page.cover;

  const thumbnail = cover
    ? cover.type === "file"
      ? cover.file.url
      : cover.external.url
    : undefined;

  return {
    id: page.id,
    title:
      page.properties.Name.type === "title"
        ? (page.properties.Name.title[0]?.plain_text ?? "")
        : "",
    thumbnail,
    description:
      page.properties.description?.type === "rich_text"
        ? (page.properties.description.rich_text[0]?.plain_text ?? "")
        : "",
    modified_date:
      page.properties.modified_date?.type === "last_edited_time"
        ? page.properties.modified_date.last_edited_time
        : undefined,
    role:
      page.properties.role?.type === "rich_text"
        ? (page.properties.role.rich_text[0]?.plain_text ?? "")
        : undefined,
    location:
      page.properties.location?.type === "rich_text"
        ? (page.properties.location.rich_text[0]?.plain_text ?? "")
        : undefined,
  };
};
