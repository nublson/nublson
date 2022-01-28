import { IBlogItem } from "./types";

export const filterPostsByCategory = (filter: string, posts: IBlogItem[]) => {
  return posts.filter((post) => {
    return post.categories.find((category) => category.name === filter);
  });
};
