import ProjectsSection from "@/sections/projects";
import { getDatabasePages, withThumbnailBlurs } from "@/services/notion";
import { formatPostMetadata, type PostMetadata } from "@/utils/formatter";

export async function getWorkProjects(): Promise<PostMetadata[]> {
  const projectPages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    20,
  );
  return withThumbnailBlurs(formatPostMetadata(projectPages));
}

export function WorkProjects({ posts }: { posts: PostMetadata[] }) {
  return <ProjectsSection title="All projects" id="projects" posts={posts} />;
}
