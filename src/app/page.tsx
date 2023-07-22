import { Metadata } from "next";
import { Header, LastPosts, WorkSection } from "../sections";

import { getData } from "@/services/notion";

import pages from "@/utils/pages.json";
import work from "@/utils/work.json";

export const metadata: Metadata = {};

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
