import slugify from "slugify";
import moment from "moment";
import { BlogItem } from "./types";

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
    read_time: 3,
  }));

  return posts;
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
    read_time: 3,
  };

  return formatedPage;
};

export const formatSlug = (data: string | any) => {
  if (typeof data === "string") {
    return slugify(data).toLowerCase();
  } else {
    return slugify(data.properties.Name.title[0].text.content).toLowerCase();
  }
};

export const formatDate = (date: string) => {
  return moment(date).format("MMMM D, YYYY");
};
