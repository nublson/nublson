import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";

/** A book's header: like a writing's, without narration. */
export function BookHero({ metadata }: { metadata: PostMetadata }) {
  return (
    <Hero
      variant="article"
      top={<BackLink href="/books" label="Books" />}
      title={metadata.title}
      bottom={
        <ArticleMeta
          date={formatPostDateFull(metadata.published_date)}
          dateTime={formatDateTimeIso(metadata.published_date)}
          category={metadata.category}
        />
      }
      description={metadata.description}
      descriptionRichText={metadata.descriptionRichText}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
