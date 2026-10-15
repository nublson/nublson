import { CoverImage } from "@/components/cover-image";
import { Typography } from "@/components/typography";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title: string;
  description?: string;
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
      {description && (
        <Typography
          size={isArticle ? "article" : "regular"}
          className="max-w-[60ch]"
        >
          {description}
        </Typography>
      )}
      {children}
      {isArticle && thumbnail && (
        <div className="relative w-full overflow-hidden rounded-[10px] after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:shadow-[inset_0_0_0_1px_var(--input)]">
          <CoverImage
            src={thumbnail}
            alt=""
            blurDataURL={blurDataURL}
            priority
            sizes="(max-width: 672px) 100vw, 640px"
            className="aspect-video"
          />
        </div>
      )}
    </header>
  );
}
