import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import { getDatabasePages, getPageData } from "@/services/notion";
import { formatPageMetadata, formatPostMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function BlogPage() {
  const page = await getPageData(process.env.NOTION_PAGE_BLOG_ID!);
  const pageMetadata = formatPageMetadata(page);

  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    20,
  );
  const blogPostMetadata = formatPostMetadata(blogPages);

  return (
    <Fragment>
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        thumbnail={pageMetadata.thumbnail}
        size="small"
      />
      <PostsSection title="Latest Posts" id="blog" posts={blogPostMetadata} />
    </Fragment>
  );
}
