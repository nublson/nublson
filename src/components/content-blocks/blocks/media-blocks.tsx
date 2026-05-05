import { withContentValidation } from "@9gustin/react-notion-render";
import type { DropedProps } from "@9gustin/react-notion-render/dist/hoc/withContentValidation";
import { CoverImage } from "../../cover-image";

export const ImageBlock = withContentValidation((props: DropedProps) => (
  <CoverImage
    src={props.media?.src ?? ""}
    alt={props.media?.alt ?? ""}
    className="my-10"
  />
));

export const VideoBlock = withContentValidation((props: DropedProps) => {
  const embedUrl = props.media?.src?.replace("watch?v=", "embed/");

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
