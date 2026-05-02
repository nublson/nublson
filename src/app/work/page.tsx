import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import ProjectsSection from "@/sections/projects";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function WorkPage() {
  const page = await getPageData(process.env.NOTION_PAGE_WORK_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Fragment>
      <Hero title={pageMetadata.title} description={pageMetadata.description} />
      <ProjectsSection title="Latest Projects" id="work" />
      <ContentSection />
    </Fragment>
  );
}
