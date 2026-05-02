import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function AboutPage() {
  const page = await getPageData(process.env.NOTION_PAGE_ABOUT_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Fragment>
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        thumbnail={pageMetadata.thumbnail}
      />
      <ContentSection />
    </Fragment>
  );
}
