import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";
import { notFound } from "next/navigation";

interface StorePageParams {
  params: {
    page: string;
  };
}

export async function generateMetadata({
  params,
}: StorePageParams): Promise<Metadata> {
  const { page } = params;

  return {
    title: pageData.blog.title,
    description: pageData.blog.description,
    alternates: {
      canonical: `/store/${page}`,
    },
    openGraph: {
      type: "website",
      url: `${process.env.BASE_URL}/store/${page}`,
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
      process.env.NOTION_DATABASE_PRODUCTS_ID as string,
      pageNumber,
      10
    );

    pages.push({ page: `${pageNumber}` });

    hasMore = data.hasMore;
    pageNumber += 1;
  }

  return pages;
}

export default async function Page({ params }: StorePageParams) {
  const { page } = params;
  const pageNumber = parseInt(page, 10);

  const data = await getData(
    process.env.NOTION_DATABASE_PRODUCTS_ID as string,
    pageNumber,
    10
  );

  if (data.posts.length) {
    return (
      <>
        <PostsSection posts={data.posts} type="store" />
        <NavComponent
          navigator="store"
          hasMore={data.hasMore}
          pageNumber={pageNumber}
        />
      </>
    );
  } else {
    notFound();
  }
}
