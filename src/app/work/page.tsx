import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import ProjectsSection from "@/sections/projects";
import { getDatabasePages, getPageData } from "@/services/notion";
import { formatPageMetadata, formatPostMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function WorkPage() {
  const page = await getPageData(process.env.NOTION_PAGE_WORK_ID!);
  const pageMetadata = formatPageMetadata(page);

  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    20,
  );

  const projectPostMetadata = formatPostMetadata(projectPages);

  return (
    <Fragment>
      <Hero title={pageMetadata.title} description={pageMetadata.description} />
      <ProjectsSection
        title="Latest Projects"
        id="work"
        posts={projectPostMetadata}
      />
      <ContentSection />
    </Fragment>
  );
}
