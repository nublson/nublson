import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";

interface BlogPageParams {
  params: {
    page?: string;
  };
}

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

export async function generateStaticParams() {
  let pageNumber = 1;
  let hasMore = true;
  const pages = [];

  while (hasMore) {
    const data = await getData(
      process.env.NOTION_DATABASE_ARTICLES_ID as string,
      pageNumber,
      10
    );

    pages.push({ page: `${pageNumber}` });

    hasMore = data.hasMore;
    pageNumber += 1;
  }

  return pages;
}

export default async function Page({ params }: BlogPageParams) {
  const { page } = params;
  const pageNumber = page ? parseInt(page, 10) : 1;

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
