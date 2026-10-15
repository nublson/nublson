import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import { ListenButton } from "@/components/listen-button";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";

export function BlogPostHero({
  metadata,
  slug,
}: {
  metadata: PostMetadata;
  /** URL slug; the narration route is keyed by it. */
  slug: string;
}) {
  return (
    <Hero
      variant="article"
      top={<BackLink href="/writings" label="Writing" />}
      title={metadata.title}
      bottom={
        <ArticleMeta
          date={formatPostDateFull(metadata.published_date)}
          dateTime={formatDateTimeIso(metadata.published_date)}
          category={metadata.category}
          actions={<ListenButton postSlug={slug} />}
        />
      }
      description={metadata.description}
      descriptionRichText={metadata.descriptionRichText}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
