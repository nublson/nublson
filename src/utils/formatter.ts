import { htmlToText } from "html-to-text";
import moment from "moment";
import slugify from "slugify";
import { IBlogCategory, IBlogItem, IIssueItem } from "./types";

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
  const formatedPage: IBlogItem = {
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
    read_time: page.properties.read_time.number
      ? page.properties.read_time.number
      : 2,
    categories: page.properties.category.multi_select.map(
      (item: IBlogCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    slug: formatSlug(page.properties.Name.title[0].text.content),
    link: page.properties.link.url ? page.properties.link.url : null,
  };

  return formatedPage;
};

export const formatPosts = (database: any[]) => {
  const posts: IBlogItem[] = database.map((post) => ({
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
    read_time: post.properties.read_time.number
      ? post.properties.read_time.number
      : 2,
    categories: post.properties.category.multi_select.map(
      (item: IBlogCategory) => ({
        id: item.id,
        name: item.name,
      })
    ),
    slug: formatSlug(post.properties.Name.title[0].text.content),
    link: post.properties.link.url ? post.properties.link.url : null,
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
