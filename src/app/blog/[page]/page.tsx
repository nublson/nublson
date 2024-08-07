import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface BlogPageParams {
  params: {
    page: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPageParams): Promise<Metadata> {
  const { page } = params;

  const baseUrl = `${process.env.BASE_URL}/blog`;
  const pageUrl = page && Number(page) > 1 ? `/blog/${page}` : "/blog";

  return {
    title: pageData.blog.title,
    description: pageData.blog.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl + (Number(page) > 1 ? `/${page}` : ""),
      title: pageData.blog.title,
      description: pageData.blog.description,
      siteName: "nublson.com",
    },
  };
}

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

export default async function BlogPage({ params }: BlogPageParams) {
  const { page } = params;
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return notFound();
  }

  const allPostsData = await getData(
    process.env.NOTION_DATABASE_ARTICLES_ID as string,
    1
  );

  const postsPerPage = 10;
  const totalPosts = allPostsData.posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (pageNumber > totalPages) {
    return notFound();
  }

  const data = await getData(
    process.env.NOTION_DATABASE_ARTICLES_ID,
    pageNumber,
    postsPerPage
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PostsSection posts={data.posts} type="blog" />
      </Suspense>
      <NavComponent
        navigator="blog"
        hasMore={data.hasMore}
        pageNumber={pageNumber}
      />
    </>
  );
}
