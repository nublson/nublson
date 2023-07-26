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
  twitter: {
    card: "summary_large_image",
    title: pageData.store.title,
    description: pageData.store.description,
    siteId: "1131704795604164615",
    creator: "@nublson",
    creatorId: "1131704795604164615",
  },
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/store`,
    title: pageData.store.title,
    description: pageData.store.description,
    siteName: "nublson.com",
  },
};

export const revalidate = 60;

export default async function Store() {
  const data = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return <PostsSection posts={data} type="products" />;
}
