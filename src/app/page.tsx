import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import ProjectsSection from "@/sections/projects";
import { getDatabasePages, getPageData } from "@/services/notion";
import { formatPageMetadata, formatPostMetadata } from "@/utils/formatter";
import { Fragment } from "react";

export default async function Home() {
  const page = await getPageData(process.env.NOTION_PAGE_HOME_ID!);
  const pageMetadata = formatPageMetadata(page);

  const blogPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Blog",
    4,
  );

  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    3,
  );

  const blogPostMetadata = formatPostMetadata(blogPages);
  const projectPostMetadata = formatPostMetadata(projectPages);

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
        posts={projectPostMetadata}
      />
      <PostsSection
        title="Latest Posts"
        href="/blog"
        id="blog"
        posts={blogPostMetadata}
      />
    </Fragment>
  );
}
