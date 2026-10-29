import { CoverImage } from "@/components/cover-image";
import { RichDescription } from "@/components/rich-description";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";
import type { RichTextItemResponse } from "@notionhq/client";

interface HeroSectionProps {
  title: string;
  description?: string;
  /** Notion rich text; when present it replaces the plain description. */
  descriptionRichText?: RichTextItemResponse[];
  thumbnail?: string;
  blurDataURL?: string;
  top?: React.ReactNode;
  bottom?: React.ReactNode;
  children?: React.ReactNode;
  variant?: "page" | "article";
}

export default function HeroSection({
  title,
  description,
  descriptionRichText,
  thumbnail,
  blurDataURL,
  top,
  bottom,
  children,
  variant = "page",
}: HeroSectionProps) {
  const isArticle = variant === "article";

  return (
    <header
      className={cn("flex w-full flex-col", isArticle ? "gap-8" : "gap-5")}
    >
      {top}
      <div className={cn("flex flex-col", isArticle ? "gap-3" : "gap-0")}>
        <Typography
          component="h1"
          variant={isArticle ? "h1" : "h2"}
          className="break-words"
        >
          {title}
        </Typography>
        {bottom}
      </div>
      {descriptionRichText && descriptionRichText.length > 0 ? (
        <div className="flex max-w-[60ch] flex-col gap-3.5">
          <RichDescription
            items={descriptionRichText}
            size={isArticle ? "article" : "regular"}
            className="text-pretty"
          />
        </div>
      ) : (
        description && (
          <Typography
            size={isArticle ? "article" : "regular"}
            className="max-w-[60ch] text-pretty"
          >
            {description}
          </Typography>
        )
      )}
      {children}
      {isArticle && thumbnail && (
        <CoverImage
          src={thumbnail}
          alt=""
          blurDataURL={blurDataURL}
          priority
          sizes="(max-width: 672px) 100vw, 640px"
          className="aspect-video"
        />
      )}
    </header>
  );
}
