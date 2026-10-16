import PostsSection from "@/sections/posts";
import { getAllPublishedPostsForFeed } from "@/services/notion";
import type { PostMetadata } from "@/utils/formatter";

/** Posts shown before the rest fold into "Show older posts". */
const VISIBLE_POSTS = 10;

/** Every published post, paging through Notion so nothing past 100 is dropped. */
export async function getBlogPosts(): Promise<PostMetadata[]> {
  return getAllPublishedPostsForFeed(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
  );
}

export function BlogPosts({ posts }: { posts: PostMetadata[] }) {
  return (
    <PostsSection
      title="All posts"
      id="writing"
      posts={posts}
      groupByYear
      collapseAfter={VISIBLE_POSTS}
    />
  );
}
