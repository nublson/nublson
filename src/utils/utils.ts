import { getData } from "../services/notion";

export const getIsCurrentPath = (path: string, pathname: string) => {
  return pathname.startsWith(`/${path}`) ? true : false;
};

export async function findPostBySlug(slug: string, databaseId: string) {
  let page = 1;
  let hasMore = true;
  let totalPosts = 0;

  while (hasMore) {
    const data = await getData(databaseId, page, 10);
    if (!data) break;

    const post = data.posts.find((post) => post.post_slug === slug);
    if (post) {
      const pageNumber = Math.floor(totalPosts / 10) + 1;
      return { post, pageNumber };
    }

    totalPosts += data.posts.length;
    hasMore = data.hasMore;
    page += 1;
  }

  return undefined;
}
