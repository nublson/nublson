import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getDatabasePages } from "@/services/notion";
import { formatPostMetadata } from "@/utils/formatter";

export async function NavigationProjects({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pages = await getDatabasePages(
    process.env.NOTION_DATABASE_CONTENT_ID!,
    "Project",
  );
  const projects = formatPostMetadata(pages);
  const index = projects.findIndex((p) => p.slug === slug);

  if (index === -1) {
    return null;
  }

  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  if (!prev && !next) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-between">
      {prev ? (
        <Link
          href={`/work/${prev.slug}`}
          className="link flex items-center justify-start gap-1"
          aria-label={`Previous project: ${prev.title}`}
        >
          <ChevronLeft aria-hidden />
          {prev.title}
        </Link>
      ) : (
        <span className="invisible pointer-events-none" aria-hidden />
      )}
      {next ? (
        <Link
          href={`/work/${next.slug}`}
          className="link flex items-center justify-end gap-1"
          aria-label={`Next project: ${next.title}`}
        >
          {next.title}
          <ChevronRight aria-hidden />
        </Link>
      ) : (
        <span className="invisible pointer-events-none" aria-hidden />
      )}
    </div>
  );
}
