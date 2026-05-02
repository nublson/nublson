import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function BlogPage() {
  const page = await getPageData(process.env.NOTION_PAGE_BLOG_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Fragment>
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        thumbnail={pageMetadata.thumbnail}
      />
      <PostsSection title="Latest Posts" id="blog" />
    </Fragment>
  );
}
