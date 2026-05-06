import PostsSection from "@/sections/posts";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function HomePosts() {
  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    4,
  );
  const blogPostMetadata = formatPostMetadata(blogPages);

  return (
    <PostsSection
      title="Latest Posts"
      href="/blog"
      id="blog"
      posts={blogPostMetadata}
    />
  );
}
