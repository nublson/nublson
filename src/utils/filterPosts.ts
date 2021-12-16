import { BlogItem } from "./types";

export const filterPostsByCategory = (filter: string, posts: BlogItem[]) => {
  return posts.filter((post) => {
    return post.categories.find((category) => category.name === filter);
  });
};
