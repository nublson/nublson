import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import { formatPosts } from "@/utils/formatter";
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

export const revalidate = 30;

export default async function Store() {
  const data = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID).then(
    (response) => formatPosts(response)
  );

  return <PostsSection posts={data} type="products" />;
}
