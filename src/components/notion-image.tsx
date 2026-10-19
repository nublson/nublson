import { plainText, resolveFileUrl, RichText, type BlockProps } from "notionic";
import { CoverImage } from "./cover-image";

/**
 * A Notion image as the site's `CoverImage`. Uploaded images already point at
 * the `/api/notion-image` proxy (see `getPageBlocks`), so their URLs don't expire.
 */
export function NotionImage({ block, context }: BlockProps<"image">) {
  const src = resolveFileUrl(block.image, block.id, context);
  if (!src) return null;
  const { caption } = block.image;

  return (
    <figure>
      <CoverImage src={src} alt={plainText(caption)} />
      {caption.length > 0 && (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          <RichText text={caption} context={context} />
        </figcaption>
      )}
    </figure>
  );
}
