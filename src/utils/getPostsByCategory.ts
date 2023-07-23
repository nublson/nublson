import { PostProps } from "./types";

export const getPostsByCategory = (
  category: string | undefined,
  posts: PostProps[]
) => {
  if (category) {
    return posts.filter((post) => post.category === category);
  } else {
    return posts;
  }
};
