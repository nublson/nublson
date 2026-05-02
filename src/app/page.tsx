import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import ProjectsSection from "@/sections/projects";
import { getPageData } from "@/services/notion";
import { Fragment } from "react";

export default async function Home() {
  const pageData = await getPageData(process.env.NOTION_PAGE_HOME_ID!);

  return (
    <Fragment>
      <Hero
        title={pageData.title}
        description={pageData.description}
        bottom={
          <div className="w-full flex items-center justify-between">
            <Typography className="font-bold text-muted-foreground">
              {pageData.role}
            </Typography>
            <Typography className="font-bold text-muted-foreground">
              📍 {pageData.location}
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
