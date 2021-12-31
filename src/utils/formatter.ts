import moment from "moment";
import slugify from "slugify";
import { BlogItem, BlogCategory } from "./types";

export const formatSlug = (data: string | any) => {
  if (typeof data === "string") {
    return slugify(data).toLowerCase();
  } else {
    return slugify(data.properties.Name.title[0].text.content).toUpperCase();
  }
};

export const formatPageProps = (page: any) => {
  const formatedPage: BlogItem = {
    id: page.id,
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    title: page.properties.Name.title[0].text.content,
    description: page.properties.description.rich_text[0].text.content,
    publish_date: page.properties.publish_date.date.start,
    modified_date: page.properties.modified_date.last_edited_time,
    read_time: 3,
    categories: page.properties.category.multi_select.map(
      (item: BlogCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    slug: formatSlug(page.properties.Name.title[0].text.content),
  };

  return formatedPage;
};

export const formatPosts = (database: any[]) => {
  const posts: BlogItem[] = database.map((post) => ({
    id: post.id,
    thumbnail:
      post.cover.type === "file"
        ? post.cover.file.url
        : post.cover.external.url,
    title: post.properties.Name.title[0].text.content,
    description: post.properties.description.rich_text[0].text.content,
    publish_date: post.properties.publish_date.date.start,
    modified_date: post.properties.modified_date.last_edited_time,
    read_time: 3,
    categories: post.properties.category.multi_select.map(
      (item: BlogCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    slug: formatSlug(post.properties.Name.title[0].text.content),
  }));

  return posts;
};

export const formatBlockWithChildren = (blocks: any[], childBlocks: any[]) => {
  return blocks.map((block) => {
    if (block.has_children && !block[block.type].children) {
      block[block.type]["children"] = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }

    return block;
  });
};

export const formatDate = (date: string) => {
  return moment(date).format("MMMM D, YYYY");
};

export const formatNumbers = (value: number) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(value)) >= 1.0e9
    ? (Math.abs(Number(value)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(value)) >= 1.0e6
    ? (Math.abs(Number(value)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(value)) >= 1.0e3
    ? (Math.abs(Number(value)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(value));
};
