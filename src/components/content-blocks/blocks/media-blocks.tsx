import { Typography } from "@/components/typography";
import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { CoverImage } from "../../cover-image";
import { toYouTubeEmbedUrl } from "../utils/to-youtube-embed-url";

export const ImageBlock = withContentValidation((props: DropedProps) => {
  const imageSrc = props.media?.src;

  if (!imageSrc) {
    return null;
  }

  return <CoverImage src={imageSrc} alt={props.media?.alt ?? ""} />;
});

export const VideoBlock = withContentValidation((props: DropedProps) => {
  const embedUrl = toYouTubeEmbedUrl(props.media?.src);

  if (!embedUrl) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-md border border-border bg-muted px-4 text-center text-sm text-muted-foreground"
        role="note"
      >
        <Typography size="small" className="text-muted-foreground">
          Video unavailable: invalid YouTube URL.
        </Typography>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      title="Embedded video"
      className="aspect-video w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
});
