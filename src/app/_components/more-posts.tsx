import PostsSection from "@/sections/posts";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function MorePosts({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    5,
  );
  const blogPostMetadata = formatPostMetadata(blogPages)
    .filter((post) => post.slug !== slug)
    .slice(0, 3);

  return (
    blogPostMetadata.length > 0 && (
      <PostsSection title="More Posts" id="blog" posts={blogPostMetadata} />
    )
  );
}
