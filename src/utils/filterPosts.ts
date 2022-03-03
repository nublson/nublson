import { IPostCategory } from "./types";

export const filterPostsByCategory = (filter: string, posts: any[]) => {
  return posts.filter((post) => {
    return post.categories.find(
      (category: IPostCategory) => category.name === filter
    );
  });
};
