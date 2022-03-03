import { IPostCategory } from "./types";

export const getCategories = (posts: any[]) => {
  let categories: IPostCategory[] = [];

  posts.forEach((post) =>
    post.categories.forEach((category: IPostCategory) => {
      const alreadyExists = categories.find((item) => item.id === category.id);

      if (!alreadyExists) {
        return categories.push({ id: category.id, name: category.name });
      }
    })
  );

  return categories;
};
