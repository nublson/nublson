import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getData } from "@/services/notion";

import pages from "@/utils/pages.json";
import work from "@/utils/work.json";

export const metadata: Metadata = {
  description: pages.home.description,
  metadataBase: new URL(process.env.BASE_URL),
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    description: pages.home.description,
    siteName: "nublson.com",
    images: [
      {
        url: pages.home.thumbnail,
      },
    ],
  },
};

export const revalidate = 60;

export default async function Home() {
  const articles = await getData(process.env.NOTION_DATABASE_ARTICLES_ID);
  const products = await getData(process.env.NOTION_DATABASE_PRODUCTS_ID);

  return (
    <>
      <Header
        label={pages.home.label}
        title={pages.home.title}
        thumbnail={pages.home.thumbnail}
        description={pages.home.description}
      />
      <WorkSection title="Creating on" workList={work.items} />
      <LastPosts
        title="Articles"
        type="articles"
        posts={[articles[0], articles[1]]}
        linkTo="/blog"
      />
      <LastPosts
        title="Products"
        type="products"
        posts={[products[0], products[1]]}
        linkTo="/store"
      />
    </>
  );
}
