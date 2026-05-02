import { PageObjectResponse } from "@notionhq/client";
import slugify from "slugify";

export const slugifyText = (text: string) => {
  return slugify(text, {
    remove: /[*+~.,()'"?!:@]/g,
    lower: true,
  });
};

export type PageMetadata = {
  id: string;
  title: string;
  slug: string;
  description: string;
  modified_date: string | undefined;
  thumbnail?: string;
  role?: string;
  location?: string;
};

export const formatPageMetadata = (page: PageObjectResponse): PageMetadata => {
  const cover = page.cover;

  const title =
    page.properties.Name.type === "title"
      ? (page.properties.Name.title[0]?.plain_text ?? "")
      : "";

  const thumbnail = cover
    ? cover.type === "file"
      ? cover.file.url
      : cover.external.url
    : undefined;

  return {
    id: page.id,
    title,
    slug: slugifyText(title),
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

export type PostMetadata = {
  id: string;
  title: string;
  slug: string;
  description: string;
  published_date: string;
  updated_date: string;
};

export const formatPostMetadata = (databasePages: PageObjectResponse[]) => {
  return databasePages.map((page) => {
    const title =
      page.properties.Name.type === "title"
        ? (page.properties.Name.title[0]?.plain_text ?? "")
        : "";

    const thumbnail =
      page.cover?.type === "file"
        ? page.cover.file.url
        : page.cover?.external.url;

    const description =
      page.properties.Description.type === "rich_text"
        ? (page.properties.Description.rich_text[0]?.plain_text ?? "")
        : "";

    const published_date =
      page.properties["Publish Date"]?.type === "date"
        ? (page.properties["Publish Date"].date?.start ?? "")
        : "";

    const updated_date = page.last_edited_time;

    return {
      id: page.id,
      title,
      slug: slugifyText(title),
      thumbnail,
      description,
      published_date,
      updated_date,
    };
  });
};

export const formatPostDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};
