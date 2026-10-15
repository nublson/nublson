import { ArticleMeta, BackLink } from "@/components/article-header-parts";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";
import { Code, ExternalLink } from "lucide-react";

export function WorkPostHero({ metadata }: { metadata: PostMetadata }) {
  return (
    <Hero
      variant="article"
      top={<BackLink href="/projects" label="Projects" />}
      title={metadata.title}
      bottom={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <ArticleMeta
            date={formatPostDateFull(metadata.published_date)}
            dateTime={formatDateTimeIso(metadata.published_date)}
          />
          {metadata.path && (
            <a
              href={metadata.path}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1.5"
            >
              <ExternalLink className="size-3.5" strokeWidth={1.5} aria-hidden /> Live demo
            </a>
          )}
          {metadata.source && (
            <a
              href={metadata.source}
              target="_blank"
              rel="noopener noreferrer"
              className="link inline-flex items-center gap-1.5"
            >
              <Code className="size-3.5" strokeWidth={1.5} aria-hidden /> Source code
            </a>
          )}
        </div>
      }
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      blurDataURL={metadata.blurDataURL}
    />
  );
}
