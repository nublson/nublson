import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { NavComponent } from "@/components/shared/NavComponent";
import pageData from "@/utils/pages.json";

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

export default async function StoreRoot() {
  const pageNumber = 1;

  const data = await getData(
    process.env.NOTION_DATABASE_PRODUCTS_ID,
    pageNumber,
    10
  );

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
}
