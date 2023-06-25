import { PostProps } from "./types";

export const getCategories = (posts: PostProps[]) => {
  let categories: {
    title: string;
  }[] = [];

  posts.forEach((post) => {
    const alreadyExists = categories.find(
      (item) => item.title === post.category
    );

    if (!alreadyExists) {
      return categories.push({ title: post.category });
    }
  });

  return categories;
};
