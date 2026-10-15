import ProjectsSection from "@/sections/projects";
import { getDatabasePages, withThumbnailBlurs } from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getHomeProjects(): Promise<PostMetadata[]> {
  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    3,
  );
  return withThumbnailBlurs(formatPostMetadata(projectPages));
}

export function HomeProjects({ posts }: { posts: PostMetadata[] }) {
  return (
    <ProjectsSection
      title="Projects"
      href="/projects"
      id="projects"
      posts={posts}
    />
  );
}
