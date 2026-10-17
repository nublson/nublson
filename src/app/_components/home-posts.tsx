import PostsSection from "@/sections/posts";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getHomePosts(): Promise<PostMetadata[]> {
  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    4,
  );
  return formatPostMetadata(blogPages);
}

export function HomePosts({ posts }: { posts: PostMetadata[] }) {
  return (
    <PostsSection title="Writing" href="/writings" id="writing" posts={posts} />
  );
}
