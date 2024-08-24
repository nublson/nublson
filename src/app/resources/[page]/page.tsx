import { Header, PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
  };
}

export async function generateStaticParams() {
  let pageNumber = 1;
  let hasMore = true;
  const pages = [];

  while (hasMore) {
    const data = await getData(
      process.env.NOTION_DATABASE_PRODUCTS_ID as string,
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
    process.env.NOTION_DATABASE_PRODUCTS_ID as string,
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

  const data = await getData(
    process.env.NOTION_DATABASE_PRODUCTS_ID,
    pageNumber,
    postsPerPage,
    "resources"
  );

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
        <PostsSection posts={data.posts} type="store" />
      </Suspense>
      <NavComponent
        navigator="resources"
        hasMore={data.hasMore}
        pageNumber={pageNumber}
      />
    </>
  );
}
