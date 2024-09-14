import moment from "moment";
import slugify from "slugify";
import { GearProps, PostProps } from "./types";

export const formatSlug = (data: string | any) => {
  const content =
    typeof data === "string"
      ? data
      : data.properties.Name.title[0].text.content;
  return slugify(content, {
    remove: /[*+~.,()'"?!:@]/g,
    lower: true,
  });
};

export const formatPosts = (database: any[]): PostProps[] => {
  return database.map((post) => {
    const author =
      post.properties.Author?.people?.length > 0
        ? post.properties.Author.people[0].name
        : undefined;

    return {
      id: post.id,
      post_slug: formatSlug(post.properties.Name.title[0].text.content),
      thumbnail:
        post.cover.type === "file"
          ? post.cover.file.url
          : post.cover.external.url,
      title: post.properties.Name.title[0].text.content,
      description:
        post.properties.Description?.rich_text?.[0]?.text?.content || null,
      publish_date: post.properties["Publish Date"].date.start,
      modified_date: post.properties["Modified Date"]?.last_edited_time,
      category: post.properties.Category?.select?.name,
      keywords: post.properties.Keywords?.rich_text?.[0]?.text?.content || null,
      path: post.properties.Path.url,
      author,
      price: post.properties.Price?.number,
    };
  });
};

export const formatGears = (database: any[]): GearProps[] => {
  return database.map((gear) => ({
    id: gear.id,
    thumbnail:
      gear.cover.type === "file"
        ? gear.cover.file.url
        : gear.cover.external.url,
    title: gear.properties.Name.title[0].text.content,
    description:
      gear.properties.description?.rich_text?.[0]?.text?.content || null,
    category: gear.properties.category?.select?.name,
    path: gear.properties.path.url,
  }));
};

export const formatPageProps = (page: any): PostProps => {
  return {
    id: page.id,
    post_slug: formatSlug(page.properties.Name.title[0].text.content),
    title: page.properties.Name.title[0].text.content,
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    description:
      page.properties.description?.rich_text?.[0]?.text?.content || "",
    category: page.properties.category?.select?.name,
    publish_date: page.properties.publish_date.date.start,
    modified_date: page.properties.modified_date?.last_edited_time,
  };
};

export const formatBlockWithChildren = (blocks: any[], childBlocks: any[]) => {
  return blocks.map((block) => {
    if (block.has_children && !block[block.type].children) {
      block[block.type].children = childBlocks.find(
        (x) => x.id === block.id
      )?.children;
    }
    return block;
  });
};

export const setToCurrentDate = (date: string | undefined, format: string) => {
  return moment(date).format(format);
};
