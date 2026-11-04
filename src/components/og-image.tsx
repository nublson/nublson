import {
  parseNotionImageProxyUrl,
  toAbsoluteAssetUrl,
} from "@/lib/notion-image";
import { resolveNotionImageUpstream } from "@/services/notion";
import { formatPostDateFull } from "@/utils/formatter";

export type OgImageData = {
  title: string;
  category?: string;
  publishedDate?: string;
  thumbnailUrl?: string;
};

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500;
  style: "normal";
};

// The site's own faces (see `src/app/layout.tsx`): Newsreader for headings,
// Inter for everything else. next/og only bundles one regular sans.
const OG_FONTS = [
  { name: "Newsreader", family: "Newsreader:opsz,wght@72,500", weight: 500 },
  { name: "Inter", family: "Inter:wght@400", weight: 400 },
] as const;

// Light theme tokens from `src/app/globals.css`, in hex for Satori. Over a
// thumbnail the card turns white-on-dark, like the site's dark theme.
const PLAIN = {
  background: "#fafafa", // --background oklch(0.985 0 0)
  foreground: "#171717", // --foreground oklch(0.205 0 0)
  subtle: "#717171", // --subtle-foreground oklch(0.55 0 0)
};
const ON_IMAGE = { foreground: "#ffffff", subtle: "rgba(255,255,255,0.75)" };

// Base64 grows the bytes by a third; this keeps the data URL well under 10 MB.
const MAX_THUMBNAIL_BYTES = 6 * 1024 * 1024;

async function fetchGoogleFont(family: string): Promise<ArrayBuffer> {
  // An old Safari user agent makes the CSS API answer with TTF, which Satori
  // reads; modern agents get WOFF2, which it can't.
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
      },
      cache: "force-cache",
    },
  ).then((res) => res.text());

  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${family}`);

  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`Font ${family}: ${res.status}`);
  return res.arrayBuffer();
}

/** Fonts for `ImageResponse`; empty when Google Fonts is unreachable, so the card still renders. */
export async function loadOgFonts(): Promise<OgFont[]> {
  try {
    return await Promise.all(
      OG_FONTS.map(async ({ name, family, weight }) => ({
        name,
        data: await fetchGoogleFont(family),
        weight,
        style: "normal" as const,
      })),
    );
  } catch {
    return [];
  }
}

/** The header's `/logo.svg`, recolored the way the header inverts it in dark mode. */
async function fetchLogoAsDataUrl(color: string): Promise<string | undefined> {
  try {
    const url = toAbsoluteAssetUrl("/logo.svg");
    if (!url?.startsWith("http")) return undefined;

    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;

    const svg = (await res.text()).replaceAll("#202020", color);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch {
    return undefined;
  }
}

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
    // The renderer parses the card as one SVG capped at 10 MB, so a larger
    // embedded image fails the whole card. Fall back to the plain one instead.
    if (buffer.byteLength > MAX_THUMBNAIL_BYTES) return undefined;
    const base64 = Buffer.from(buffer).toString("base64");
    const mimeType = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  } catch {
    return undefined;
  }
}

export type OgImageProps = {
  title: string;
  category: string;
  date: string;
  logoSrc?: string;
  thumbnailSrc?: string;
};

export async function resolveOgImageData(
  data: OgImageData,
): Promise<OgImageProps> {
  const { title, category = "", publishedDate, thumbnailUrl } = data;
  const thumbnailSrc = thumbnailUrl
    ? await fetchThumbnailAsDataUrl(thumbnailUrl)
    : undefined;
  const logoSrc = await fetchLogoAsDataUrl(
    thumbnailSrc ? ON_IMAGE.foreground : PLAIN.foreground,
  );
  const date = publishedDate ? formatPostDateFull(publishedDate) : "";

  return { title, category, date, logoSrc, thumbnailSrc };
}

export function OgImageTemplate({
  title,
  category,
  date,
  logoSrc,
  thumbnailSrc,
}: OgImageProps) {
  const colors = thumbnailSrc ? ON_IMAGE : PLAIN;
  const fontSize = title.length > 60 ? 60 : 72;
  const meta = [date, category].filter(Boolean);

  // The article header at share size: logo top left, then the title over its
  // date · category line at the bottom. Over a thumbnail, a gradient at each
  // end keeps the logo and the text legible.
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: PLAIN.background,
        fontFamily: "Inter",
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
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 80,
          ...(thumbnailSrc
            ? {
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,0.9) 100%)",
              }
            : {}),
        }}
      >
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt="" width={56} height={56} />
        ) : (
          <div style={{ display: "flex" }} />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "block",
              color: colors.foreground,
              fontFamily: "Newsreader",
              fontSize,
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              lineClamp: 3,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          {meta.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: 14,
                color: colors.subtle,
                fontSize: 28,
              }}
            >
              {meta.map((part, i) => (
                <div key={part} style={{ display: "flex", gap: 14 }}>
                  {i > 0 ? <span style={{ opacity: 0.6 }}>·</span> : null}
                  <span>{part}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
