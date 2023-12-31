import { PostsSection } from "@/sections";
import { getData } from "@/services/notion";
import { Metadata } from "next";

import pageData from "@/utils/pages.json";

export const metadata: Metadata = {
  title: pageData.books.title,
  description: pageData.books.description,
  alternates: {
    canonical: `/books`,
  },
  openGraph: {
    type: "website",
    url: `${process.env.BASE_URL}/books`,
    title: pageData.books.title,
    description: pageData.books.description,
    siteName: "nublson.com",
  },
};

export default async function Books() {
  const data = await getData(process.env.NOTION_DATABASE_BOOKS_ID);

  return <PostsSection posts={data} type="store" />;
}
