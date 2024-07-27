import { getData } from "../services/notion";

export const getIsCurrentPath = (path: string, pathname: string) => {
  return pathname.startsWith(`/${path}`);
};

export async function findPostBySlug(slug: string, databaseId: string) {
  let page = 1;
  let totalPosts = 0;

  while (true) {
    const data = await getData(databaseId, page, 10);
    if (!data) break;

    const post = data.posts.find((post) => post.post_slug === slug);
    if (post) {
      const pageNumber = Math.floor(totalPosts / 10) + 1;
      return { post, pageNumber };
    }

    totalPosts += data.posts.length;
    if (!data.hasMore) break;
    page += 1;
  }

  return undefined;
}
