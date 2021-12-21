import { BlogCategory, BlogItem } from "./types";

export const getCategories = (posts: BlogItem[]) => {
  let categories: BlogCategory[] = [];

  posts.forEach((post) =>
    post.categories.forEach((category) => {
      const alreadyExists = categories.find((item) => item.id === category.id);

      if (!alreadyExists) {
        return categories.push({ id: category.id, name: category.name });
      }
    })
  );

  return categories;
};
