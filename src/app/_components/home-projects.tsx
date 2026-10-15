import ProjectsSection from "@/sections/projects";
import { getDatabasePages, withThumbnailBlurs } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function HomeProjects() {
  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    3,
  );
  const projectPostMetadata = await withThumbnailBlurs(
    formatPostMetadata(projectPages),
  );

  return (
    <ProjectsSection
      title="Projects"
      href="/projects"
      id="projects"
      posts={projectPostMetadata}
    />
  );
}
