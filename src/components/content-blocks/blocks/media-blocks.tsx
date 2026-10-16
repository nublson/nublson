import { Typography } from "@/components/typography";
import { CoverImage } from "../../cover-image";
import { renderRichTextNode } from "../rich-text";
import { notionLinkAttributes } from "../link-attributes";
import { plainText } from "../text-utils";
import type { BlockProps } from "../types";
import { toYouTubeEmbedUrl } from "../utils/to-youtube-embed-url";

type FilePayload =
  | { type: "external"; external: { url: string } }
  | { type: "file"; file: { url: string } }
  | { type: string };

/** The URL of a Notion file payload (uploaded or external). */
function fileUrl(payload: FilePayload): string | undefined {
  if ("external" in payload) return payload.external.url;
  if ("file" in payload) return payload.file.url;
  return undefined;
}

const FRAME_CLASS = "aspect-video w-full";

export function ImageBlock({ block }: BlockProps<"image">) {
  const src = fileUrl(block.image);
  if (!src) return null;

  return <CoverImage src={src} alt={plainText(block.image.caption)} />;
}

export function VideoBlock({ block }: BlockProps<"video">) {
  const embedUrl = toYouTubeEmbedUrl(fileUrl(block.video));

  if (!embedUrl) {
    return (
      <div
        className="flex aspect-video w-full items-center justify-center rounded-[10px] bg-card shadow-[inset_0_0_0_1px_var(--input)] px-4 text-center text-sm text-muted-foreground"
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
      title={plainText(block.video.caption) || "Embedded video"}
      className={FRAME_CLASS}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export function EmbedBlock({ block }: BlockProps<"embed" | "pdf">) {
  const payload = block.type === "embed" ? block.embed : block.pdf;
  const src = "url" in payload ? payload.url : fileUrl(payload);
  if (!src) return null;

  return (
    <iframe
      src={src}
      title={plainText(payload.caption) || "Embedded content"}
      className={FRAME_CLASS}
      loading="lazy"
    />
  );
}

/** Files and bookmarks: a plain link to the target. */
export function LinkBlock({ block }: BlockProps<"file" | "bookmark">) {
  const url =
    block.type === "bookmark" ? block.bookmark.url : fileUrl(block.file);
  if (!url) return null;
  const label =
    (block.type === "bookmark"
      ? plainText(block.bookmark.caption)
      : block.file.name || plainText(block.file.caption)) || url;

  return (
    <Typography size="article" className="w-full max-w-[64ch]">
      {renderRichTextNode({ plain_text: label, href: url }, notionLinkAttributes)}
    </Typography>
  );
}
