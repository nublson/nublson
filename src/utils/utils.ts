import { getData } from "../services/notion";

export const getIsCurrentPath = (path: string, pathname: string) => {
  return pathname.startsWith(`/${path}`);
};

export async function findPostBySlug(slug: string, databaseId: string) {
  try {
    const data = await getData(databaseId, 1);

    if (!data || data.posts.length === 0) {
      return undefined;
    }

    const post = data.posts.find((post) => post.post_slug === slug);
    return post || undefined;
  } catch (error) {
    return undefined;
  }
}
