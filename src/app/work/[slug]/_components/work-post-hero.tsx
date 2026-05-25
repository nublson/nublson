import { HeadingTop } from "@/components/heading-top";
import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import type { PostMetadata } from "@/utils/formatter";
import { formatDateTimeIso, formatPostDateFull } from "@/utils/formatter";
import { Code, ExternalLink } from "lucide-react";

export function WorkPostHero({ metadata }: { metadata: PostMetadata }) {
  const dateLabel = formatPostDateFull(metadata.published_date);
  const dateTime = formatDateTimeIso(metadata.published_date);

  return (
    <Hero
      top={
        <HeadingTop
          title={metadata.title}
          date={dateLabel}
          dateTime={dateTime}
          postsPath="/work"
          postType="Projects"
        />
      }
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.thumbnail}
      size="small"
      bottom={
        metadata.path || metadata.source ? (
          <div className="w-full flex items-center justify-between gap-2">
            {metadata.path && (
              <Typography className="link justify-start" size="small">
                <a
                  href={metadata.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="size-4" /> Live Demo
                </a>
              </Typography>
            )}
            {metadata.source && (
              <Typography className="link justify-end" size="small">
                <a
                  href={metadata.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Code className="size-4" /> Source Code
                </a>
              </Typography>
            )}
          </div>
        ) : null
      }
    />
  );
}
