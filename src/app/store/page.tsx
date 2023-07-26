import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

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
    images: [
      {
        url: pageData.store.thumbnail,
        width: 1920,
        height: 1080,
      },
    ],
  },
};

export const revalidate = 60;

export default async function Store() {
  const data = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return <PostsSection posts={data} type="products" />;
}
