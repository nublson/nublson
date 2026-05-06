import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { CoverImage } from "../../cover-image";
import { toYouTubeEmbedUrl } from "../utils/to-youtube-embed-url";

export const ImageBlock = withContentValidation((props: DropedProps) => (
  <CoverImage src={props.media?.src ?? ""} alt={props.media?.alt ?? ""} />
));

export const VideoBlock = withContentValidation((props: DropedProps) => {
  const embedUrl = toYouTubeEmbedUrl(props.media?.src);

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
