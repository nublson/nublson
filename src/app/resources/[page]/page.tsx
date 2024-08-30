import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostProps } from "@/utils/types";

interface ResourcesPageParams {
  params: {
    page: string;
  };
}

export async function generateMetadata({
  params,
}: ResourcesPageParams): Promise<Metadata> {
  const { page } = params;

  const baseUrl = `${process.env.BASE_URL}/resources`;
  const pageUrl =
    page && Number(page) > 1 ? `/resources/${page}` : "/resources";

  return {
    title: pageData.resources.title,
    description: pageData.resources.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: baseUrl + (Number(page) > 1 ? `/${page}` : ""),
      title: pageData.resources.title,
      description: pageData.resources.description,
      siteName: "nublson.com",
    },
    twitter: {
      card: "summary_large_image",
      site: pageUrl,
      title: pageData.resources.title,
      description: pageData.resources.description,
      images: pageData.resources.thumbnail,
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
      "Store",
      pageNumber,
      10,
      "resources"
    );

    pages.push({ page: `${pageNumber}` });

    hasMore = data.hasMore;
    pageNumber += 1;
  }

  return pages;
}

export default async function ResourcesPage({ params }: ResourcesPageParams) {
  const { page } = params;
  const pageNumber = Number(page);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return notFound();
  }

  const allPostsData = await getData(
    process.env.NOTION_DATABASE_CONTENT_ID as string,
    "Store",
    1,
    undefined,
    "resources"
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
    "Store",
    pageNumber,
    postsPerPage,
    "resources"
  );

  const postsWithPageNumber: PostProps[] = data.posts.map((post) => ({
    ...post,
    pageNumber: pageNumber,
  }));

  return (
    <>
      <Header
        label={pageData.resources.label}
        title={pageData.resources.title}
        thumbnail={pageData.resources.thumbnail}
        description={pageData.resources.description}
        scrollIcon
      />
      <Suspense fallback={<div>Loading...</div>}>
        <PostsSection
          posts={postsWithPageNumber}
          allPosts={allPostsData.posts}
          type="store"
          pageNumber={pageNumber}
          totalPages={totalPages}
          hasMore={data.hasMore}
          navigator="resources"
        />
      </Suspense>
    </>
  );
}
