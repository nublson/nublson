import { getDatabasePageBySlug } from "@/services/notion";
import { projectHref } from "@/utils/project-links";
import { permanentRedirect } from "next/navigation";

export const revalidate = 10;

/**
 * Projects no longer have pages of their own. Old links and search results
 * land on the project itself, or on the projects list when it has no link.
 */
export default async function ProjectRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getDatabasePageBySlug(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
    slug,
  );
  permanentRedirect((found && projectHref(found.metadata)) ?? "/projects");
}
