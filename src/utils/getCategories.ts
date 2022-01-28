import { IBlogCategory, IBlogItem } from "./types";

export const getCategories = (posts: IBlogItem[]) => {
  let categories: IBlogCategory[] = [];

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
