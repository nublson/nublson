import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostProps } from "@/utils/types";

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
    twitter: {
      card: "summary_large_image",
      site: pageUrl,
      title: pageData.blog.title,
      description: pageData.blog.description,
      images: pageData.blog.thumbnail,
      creator: "@nublson",
    },
  };
}

export async function generateStaticParams() {
  let pageNumber = 1;
  let hasMore = true;
  const pages = [];

  while (hasMore) {
    const data = await getData(
      process.env.NOTION_DATABASE_CONTENT_ID as string,
      "Blog",
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
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Blog",
    1
  );

  const postsPerPage = 10;
  const totalPosts = allPostsData.posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (pageNumber > totalPages) {
    return notFound();
  }

  allPostsData.posts.forEach((post, index) => {
    post.pageNumber = Math.floor(index / postsPerPage) + 1;
  });

  const data = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID,
    "Blog",
    pageNumber,
    postsPerPage
  );

  const postsWithPageNumber: PostProps[] = data.posts.map((post) => ({
    ...post,
    pageNumber: pageNumber,
  }));

  return (
    <>
      <Header
        label={pageData.blog.label}
        title={pageData.blog.title}
        thumbnail={pageData.blog.thumbnail}
        description={pageData.blog.description}
        scrollIcon
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PostsSection
          posts={postsWithPageNumber}
          allPosts={allPostsData.posts}
          type="blog"
          pageNumber={pageNumber}
          totalPages={totalPages}
          hasMore={data.hasMore}
          navigator="blog"
        />
      </Suspense>
    </>
  );
}
