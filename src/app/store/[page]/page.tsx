import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";

interface StorePageParams {
  params: {
    page?: string;
  };
}

export const metadata: Metadata = {
  title: pageData.store.title,
  description: pageData.store.description,
  alternates: {
    canonical: `/store`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/store`,
    title: pageData.store.title,
    description: pageData.store.description,
    siteName: "nublson.com",
  },
};

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

    if (pageNumber === 1) {
      pages.push({ page: "" });
    } else {
      pages.push({ page: `${pageNumber}` });
    }

    hasMore = data.hasMore;
    pageNumber += 1;
  }

  return pages;
}

export default async function Page({ params }: StorePageParams) {
  const { page } = params;
  const pageNumber = page ? parseInt(page, 10) : 1;

  const data = await getData(
    process.env.NOTION_DATABASE_PRODUCTS_ID as string,
    pageNumber,
    10
  );

  return (
    <>
      <PostsSection posts={data.posts} type="store" />;
      <NavComponent
        navigator="store"
        hasMore={data.hasMore}
        pageNumber={pageNumber}
      />
    </>
  );
}
