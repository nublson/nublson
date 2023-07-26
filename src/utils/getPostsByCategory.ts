import { PageProps } from "./types";

export const getPostsByCategory = (
  category: string | undefined,
  posts: PageProps[]
) => {
  if (category) {
    return posts.filter((post) => post.category === category);
  } else {
    return posts;
  }
};
