import { HeadingTop } from "@/components/heading-top";
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
    />
  );
}
