import { PageProps } from "./types";

export const getCategories = (posts: PageProps[]) => {
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
