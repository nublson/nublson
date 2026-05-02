import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import { getPageBlocks, getPageData } from "@/services/notion";
import { formatBlockWithChildren, formatPageMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function AboutPage() {
  const page = await getPageData(process.env.NOTION_PAGE_ABOUT_ID!);
  const pageBlocks = await getPageBlocks(process.env.NOTION_PAGE_ABOUT_ID!);

  const pageMetadata = formatPageMetadata(page);
  const pageContent = formatBlockWithChildren(pageBlocks);

  return (
    <Fragment>
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        thumbnail={pageMetadata.thumbnail}
        size="small"
      />
      <ContentSection blocks={pageContent} />
    </Fragment>
  );
}
