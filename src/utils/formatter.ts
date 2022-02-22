import { htmlToText } from "html-to-text";
import moment from "moment";
import slugify from "slugify";
import { IIssueItem, IPostCategory, IPostItem } from "./types";

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

export const formatPageProps = (page: any) => {
  const formatedPage: IPostItem = {
    id: page.id,
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    title: page.properties.Name.title[0].text.content,
    description: page.properties.description.rich_text.length
      ? page.properties.description.rich_text[0].text.content
      : null,
    publish_date: page.properties.publish_date.date.start,
    modified_date: page.properties.modified_date.last_edited_time,
    amount: page.properties.amount.rich_text[0].text.content,
    categories: page.properties.category.multi_select.map(
      (item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    page_slug: formatSlug(page.properties.Name.title[0].text.content),
    podcast_slug: page.properties.podcast_slug.rich_text.length
      ? page.properties.podcast_slug.rich_text[0].text.content
      : null,
    refer_link: page.properties.refer_link.url
      ? page.properties.refer_link.url
      : null,
    member_link: page.properties.member_link.url
      ? page.properties.member_link.url
      : null,
    access: page.properties.access.select
      ? page.properties.access.select.name
      : "public",
  };

  return formatedPage;
};

export const formatPosts = (database: any[]) => {
  const posts: IPostItem[] = database.map((post) => ({
    id: post.id,
    thumbnail:
      post.cover.type === "file"
        ? post.cover.file.url
        : post.cover.external.url,
    title: post.properties.Name.title[0].text.content,
    description: post.properties.description.rich_text.length
      ? post.properties.description.rich_text[0].text.content
      : null,
    publish_date: post.properties.publish_date.date.start,
    modified_date: post.properties.modified_date.last_edited_time,
    amount: post.properties.amount.rich_text[0].text.content,
    categories: post.properties.category.multi_select.map(
      (item: IPostCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    page_slug: formatSlug(post.properties.Name.title[0].text.content),
    podcast_slug: post.properties.podcast_slug.rich_text.length
      ? post.properties.podcast_slug.rich_text[0].text.content
      : null,
    refer_link: post.properties.refer_link.url
      ? post.properties.refer_link.url
      : null,
    member_link: post.properties.member_link.url
      ? post.properties.member_link.url
      : null,
    access: post.properties.access.select
      ? post.properties.access.select.name
      : "public",
  }));

  return posts;
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
