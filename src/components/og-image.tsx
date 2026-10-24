import {
  parseNotionImageProxyUrl,
  toAbsoluteAssetUrl,
} from "@/lib/notion-image";
import { resolveNotionImageUpstream } from "@/services/notion";

export type OgImageData = {
  title: string;
  category?: string;
  thumbnailUrl?: string;
};

async function fetchThumbnailAsDataUrl(
  thumbnailUrl: string,
): Promise<string | undefined> {
  try {
    const proxy = parseNotionImageProxyUrl(thumbnailUrl);
    const upstreamUrl = proxy
      ? (await resolveNotionImageUpstream(proxy.resource, proxy.id)).url
      : toAbsoluteAssetUrl(thumbnailUrl);

    if (!upstreamUrl) return undefined;

    const res = await fetch(upstreamUrl, { cache: "no-store" });
    if (!res.ok) return undefined;

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return undefined;
  }
}

export async function resolveOgImageData(
  data: OgImageData,
): Promise<{ title: string; category: string; thumbnailSrc?: string }> {
  const { title, category = "", thumbnailUrl } = data;
  const thumbnailSrc = thumbnailUrl
    ? await fetchThumbnailAsDataUrl(thumbnailUrl)
    : undefined;

  return { title, category, thumbnailSrc };
}

export function OgImageTemplate({
  title,
  category,
  thumbnailSrc,
}: {
  title: string;
  category: string;
  thumbnailSrc?: string;
}) {
  const fontSize = title.length > 60 ? "52px" : "68px";

  // One layout with or without a thumbnail: the text sits at the bottom, over
  // the image and its gradient when there is one, on the dark background otherwise.
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        ...(thumbnailSrc
          ? {
              backgroundImage: `url(${thumbnailSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "80px",
          justifyContent: "flex-end",
          ...(thumbnailSrc
            ? {
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.9) 100%)",
              }
            : {}),
        }}
      >
        {category ? (
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "24px",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: "14px",
            }}
          >
            {category}
          </span>
        ) : null}
        <h1
          style={{
            color: "#ffffff",
            fontSize,
            fontFamily: "sans-serif",
            fontWeight: 700,
            lineHeight: 1.15,
            margin: "0 0 36px 0",
            maxWidth: "1000px",
          }}
        >
          {title}
        </h1>
        <span
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: "26px",
            fontFamily: "sans-serif",
          }}
        >
          nublson.com
        </span>
      </div>
    </div>
  );
}
