import ProjectsSection from "@/sections/projects";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function HomeProjects() {
  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    3,
  );
  const projectPostMetadata = formatPostMetadata(projectPages);

  return (
    <ProjectsSection
      title="Latest Projects"
      href="/work"
      id="work"
      posts={projectPostMetadata}
      className="grid auto-rows-fr grid-cols-[repeat(auto-fill,minmax(240px,1fr))] justify-center gap-5"
    />
  );
}
