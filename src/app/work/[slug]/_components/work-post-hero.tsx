import { HeadingTop } from "@/components/heading-top";
import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import { getDatabasePageBySlug } from "@/services/notion";
import { formatPostDateFull } from "@/utils/formatter";
import { notFound } from "next/navigation";

export async function WorkPostHero({
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
  if (!found) notFound();

  const { metadata } = found;
  const dateLabel = formatPostDateFull(metadata.published_date);

  return (
    <Hero
      top={
        <HeadingTop
          title={metadata.title}
          date={dateLabel}
          dateTime={metadata.published_date}
          postsPath="/work"
          postType="Projects"
        />
      }
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      size="small"
      bottom={
        metadata.path || metadata.figma ? (
          <div className="w-full flex items-center justify-between gap-2">
            {metadata.path && (
              <Typography className="link justify-start" size="small">
                <a
                  href={metadata.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">🔗</span> Live Demo
                </a>
              </Typography>
            )}
            {metadata.figma && (
              <Typography className="link justify-end" size="small">
                <a
                  href={metadata.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">🎨</span> Figma Design
                </a>
              </Typography>
            )}
          </div>
        ) : null
      }
    />
  );
}
