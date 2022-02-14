import { IPostItem } from "./types";

export const filterPostsByCategory = (filter: string, posts: IPostItem[]) => {
  return posts.filter((post) => {
    return post.categories.find((category) => category.name === filter);
  });
};

export const filterPostsByTitle = (title: string, posts: IPostItem[]) => {
  return posts.filter((post) => {
    return post.title.toLowerCase().includes(title.toLowerCase());
  });
};
