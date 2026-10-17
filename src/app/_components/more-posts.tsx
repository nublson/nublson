import PostsSection from "@/sections/posts";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getMorePosts(
  currentTitle: string,
): Promise<PostMetadata[]> {
  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    3,
    undefined,
    undefined,
    currentTitle,
  );
  return formatPostMetadata(blogPages);
}

export function MorePosts({ posts }: { posts: PostMetadata[] }) {
  if (posts.length === 0) return null;

  return (
    <PostsSection title="More posts" href="/writings" id="blog" posts={posts} />
  );
}
