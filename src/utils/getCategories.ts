import { PostProps } from "./types";

export const getCategories = (posts: PostProps[]) => {
  const categories: { title: string }[] = [];

  posts.forEach((post) => {
    if (
      post.category &&
      !categories.some((item) => item.title === post.category)
    ) {
      categories.push({ title: post.category });
    }
  });

  return categories;
};
