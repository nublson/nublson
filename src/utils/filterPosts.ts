import { IPostItem } from "./types";

export const filterPostsByCategory = (filter: string, posts: IPostItem[]) => {
  return posts.filter((post) => {
    return post.categories.find((category) => category.name === filter);
  });
};
