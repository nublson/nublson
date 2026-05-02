import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import ProjectsSection from "@/sections/projects";
import { getPageData } from "@/services/notion";
import { formatPageMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function Home() {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const pageMetadata = formatPageMetadata(page);

  return (
    <Fragment>
      <Hero
        title={pageMetadata.title}
        description={pageMetadata.description}
        bottom={
          <div className="w-full flex items-center justify-between">
            <Typography className="font-bold text-muted-foreground">
              {pageMetadata.role}
            </Typography>
            <Typography className="font-bold text-muted-foreground">
              📍 {pageMetadata.location}
            </Typography>
          </div>
        }
      />
      <ProjectsSection
        title="Latest Projects"
        href="/work"
        id="work"
        postSize="sm"
      />
      <PostsSection title="Latest Posts" href="/blog" id="blog" />
    </Fragment>
  );
}
