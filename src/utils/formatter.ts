import { htmlToText } from "html-to-text";
import moment from "moment";
import slugify from "slugify";
import { IBookItem, IIssueItem, IPostCategory, IPostItem } from "./types";

export const formatSlug = (data: string | any) => {
  if (typeof data === "string") {
    return slugify(data, {
      remove: /[*+~.()'"?!:@]/g,
      lower: true,
    });
  } else {
    return slugify(data.properties.Name.title[0].text.content, {
      remove: /[*+~.()'"?!:@]/g,
      lower: true,
    });
  }
};

export const formatPostProps = (page: any) => {
  const formatedPage: IPostItem = {
    id: page.id,
    post_slug: formatSlug(page.properties.Name.title[0].text.content),
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    title: page.properties.Name.title[0].text.content,
    description: page.properties.description.rich_text[0].text.content,
    access: page.properties.access.select
      ? page.properties.access.select.name
      : "public",
    publish_date: page.properties.publish_date.date.start,
    categories: page.properties.categories.multi_select.map(
      (item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    modified_date: page.properties.modified_date.last_edited_time,
    member_link: page.properties.member_link.url
      ? page.properties.member_link.url
      : null,
    amount: page.properties.amount.rich_text[0].text.content,
    refer_link: page.properties.refer_link.url
      ? page.properties.refer_link.url
      : null,
  };

  return formatedPage;
};

export const formatBookProps = (page: any) => {
  const formatedBook: IBookItem = {
    id: page.id,
    post_slug: formatSlug(page.properties.Name.title[0].text.content),
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    title: page.properties.Name.title[0].text.content,
    description: page.properties.description.rich_text[0].text.content,
    author: page.properties.author.rich_text[0].text.content,
    publish_date: page.properties.publish_date.date.start,
    categories: page.properties.categories.multi_select
      .map((item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      }))
      .slice(0, 1),
    modified_date: page.properties.modified_date.last_edited_time,
    refer_link: page.properties.refer_link.url
      ? page.properties.refer_link.url
      : null,
  };

  return formatedBook;
};

export const formatPosts = (database: any[]) => {
  const posts: IPostItem[] = database.map((post) => ({
    id: post.id,
    post_slug: formatSlug(post.properties.Name.title[0].text.content),
    thumbnail:
      post.cover.type === "file"
        ? post.cover.file.url
        : post.cover.external.url,
    title: post.properties.Name.title[0].text.content,
    description: post.properties.description.rich_text.length
      ? post.properties.description.rich_text[0].text.content
      : null,
    access: post.properties.access.select
      ? post.properties.access.select.name
      : "public",
    publish_date: post.properties.publish_date.date.start,
    categories: post.properties.categories.multi_select.map(
      (item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    modified_date: post.properties.modified_date.last_edited_time,
    member_link: post.properties.member_link.url
      ? post.properties.member_link.url
      : null,
    amount: post.properties.amount.rich_text[0].text.content,
    refer_link: post.properties.refer_link.url
      ? post.properties.refer_link.url
      : null,
  }));

  return posts;
};

export const formatBooks = (database: any[]) => {
  const books: IBookItem[] = database.map((post) => ({
    id: post.id,
    post_slug: formatSlug(post.properties.Name.title[0].text.content),
    thumbnail:
      post.cover.type === "file"
        ? post.cover.file.url
        : post.cover.external.url,
    title: post.properties.Name.title[0].text.content,
    description: post.properties.description.rich_text.length
      ? post.properties.description.rich_text[0].text.content
      : null,
    author: post.properties.author.rich_text[0].text.content,
    publish_date: post.properties.publish_date.date.start,
    categories: post.properties.categories.multi_select
      .map((item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      }))
      .slice(0, 1),
    modified_date: post.properties.modified_date.last_edited_time,
    refer_link: post.properties.refer_link.url
      ? post.properties.refer_link.url
      : null,
  }));

  return books;
};

export const formatIssues = (database: any[]) => {
  const issues: IIssueItem[] = database.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: htmlToText(issue.description),
    publish_date: formatDate(issue.sent_at),
    url: issue.url,
  }));

  return issues;
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

export const formatString = (textValue: string, textLength: number) => {
  return `${textValue.substring(0, textLength)}...`;
};
