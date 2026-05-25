import { HeadingTop } from "@/components/heading-top";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatPostDateFull } from "@/utils/formatter";

export function BlogPostHero({ metadata }: { metadata: PostMetadata }) {
  const dateLabel = formatPostDateFull(metadata.published_date);

  return (
    <Hero
      top={
        <HeadingTop
          title={metadata.title}
          date={dateLabel}
          dateTime={metadata.published_date}
          postsPath="/blog"
        />
      }
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      size="small"
    />
  );
}
