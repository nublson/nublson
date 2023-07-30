import moment from "moment";
import slugify from "slugify";
import { GearProps, PageProps } from "./types";

export const formatSlug = (data: string | any) => {
  if (typeof data === "string") {
    return slugify(data, {
      remove: /[*+~.,()'"?!:@]/g,
      lower: true,
    });
  } else {
    return slugify(data.properties.Name.title[0].text.content, {
      remove: /[*+~.,()'"?!:@]/g,
      lower: true,
    });
  }
};

export const formatPosts = (database: any[]) => {
  const posts: PageProps[] = database.map((post) => {
    return {
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
      publish_date: post.properties.publish_date.date.start,
      modified_date: post.properties.modified_date.last_edited_time,
      category: post.properties.category.select.name,
      path: post.properties.path.url,
    };
  });

  return posts;
};

export const formatGears = (database: any[]) => {
  const gears: GearProps[] = database.map((gear) => {
    return {
      id: gear.id,
      thumbnail:
        gear.cover.type === "file"
          ? gear.cover.file.url
          : gear.cover.external.url,
      title: gear.properties.Name.title[0].text.content,
      description: gear.properties.description.rich_text.length
        ? gear.properties.description.rich_text[0].text.content
        : null,
      category: gear.properties.category.select.name,
      path: gear.properties.path.url,
    };
  });

  return gears;
};

export const formatPageProps = (page: any) => {
  const formatedPage: PageProps = {
    id: page.id,
    post_slug: formatSlug(page.properties.Name.title[0].text.content),
    title: page.properties.Name.title[0].text.content,
    thumbnail:
      page.cover.type === "file"
        ? page.cover.file.url
        : page.cover.external.url,
    description: page.properties.description.rich_text[0].text.content,
    category: page.properties.category.select.name,
    publish_date: page.properties.publish_date.date.start,
    modified_date: page.properties.modified_date.last_edited_time,
  };

  return formatedPage;
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

export const setToCurrentDate = (date: string, format: string) => {
  return moment(date).format(format);
};
