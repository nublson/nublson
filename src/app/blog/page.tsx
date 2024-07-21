import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";

export const metadata: Metadata = {
  title: pageData.blog.title,
  description: pageData.blog.description,
  alternates: {
    canonical: `/blog`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/blog`,
    title: pageData.blog.title,
    description: pageData.blog.description,
    siteName: "nublson.com",
  },
};

export default async function BlogRoot() {
  const pageNumber = 1;

  const data = await getData(
    process.env.NOTION_DATABASE_ARTICLES_ID as string,
    pageNumber,
    10
  );

  return (
    <>
      <PostsSection posts={data.posts} type="blog" />
      <NavComponent
        navigator="blog"
        hasMore={data.hasMore}
        pageNumber={pageNumber}
      />
    </>
  );
}
