import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";

export function BlogPostHero({ metadata }: { metadata: PostMetadata }) {
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
        />
      }
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
