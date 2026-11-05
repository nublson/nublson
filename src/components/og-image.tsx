import {
  parseNotionImageProxyUrl,
  toAbsoluteAssetUrl,
} from "@/lib/notion-image";
import { resolveNotionImageUpstream } from "@/services/notion";

export type OgImageData = {
  title: string;
  thumbnailUrl?: string;
};

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 600;
  style: "normal";
};

// The card's only text is the title, in the site's sans (see
// `src/app/layout.tsx`) at its heading weight; next/og only bundles a regular.
const OG_FONT = { name: "Inter", family: "Inter:wght@600", weight: 600 } as const;

// Light theme tokens from `src/app/globals.css`, in hex for Satori. Over a
// thumbnail the card turns white-on-dark, like the site's dark theme.
const PLAIN = {
  background: "#fafafa", // --background oklch(0.985 0 0)
  foreground: "#171717", // --foreground oklch(0.205 0 0)
};
const ON_IMAGE = { foreground: "#ffffff" };

// A slow font or logo host falls back instead of holding the card.
const ASSET_TIMEOUT_MS = 3000;

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
      signal: AbortSignal.timeout(ASSET_TIMEOUT_MS),
    },
  ).then((res) => res.text());

  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TTF for ${family}`);

  const res = await fetch(url, {
    cache: "force-cache",
    signal: AbortSignal.timeout(ASSET_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Font ${family}: ${res.status}`);
  return res.arrayBuffer();
}

/** Fonts for `ImageResponse`; empty when Google Fonts is unreachable, so the card still renders. */
export async function loadOgFonts(): Promise<OgFont[]> {
  try {
    const { name, family, weight } = OG_FONT;
    return [
      { name, data: await fetchGoogleFont(family), weight, style: "normal" },
    ];
  } catch {
    return [];
  }
}

/** The header's `/logo.svg`, recolored the way the header inverts it in dark mode. */
async function fetchLogoAsDataUrl(color: string): Promise<string | undefined> {
  try {
    const url = toAbsoluteAssetUrl("/logo.svg");
    if (!url?.startsWith("http")) return undefined;

    const res = await fetch(url, {
      cache: "force-cache",
      signal: AbortSignal.timeout(ASSET_TIMEOUT_MS),
    });
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
  logoSrc?: string;
  thumbnailSrc?: string;
};

export async function resolveOgImageData(
  data: OgImageData,
): Promise<OgImageProps> {
  const { title, thumbnailUrl } = data;
  const thumbnailSrc = thumbnailUrl
    ? await fetchThumbnailAsDataUrl(thumbnailUrl)
    : undefined;
  const logoSrc = await fetchLogoAsDataUrl(
    thumbnailSrc ? ON_IMAGE.foreground : PLAIN.foreground,
  );

  return {
    title: truncateAtWord(typographicApostrophes(title), MAX_TITLE_CHARS),
    logoSrc,
    thumbnailSrc,
  };
}

// About two lines of the title at 60px; past it, `lineClamp` would cut mid-word.
const MAX_TITLE_CHARS = 60;

function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  const end = cut.lastIndexOf(" ");
  return `${(end > 0 ? cut.slice(0, end) : text.slice(0, max)).replace(/[\s,;:.\u2013\u2014-]+$/, "")}\u2026`;
}

/** "won't" → "won’t"; Notion titles often carry the keyboard apostrophe. */
function typographicApostrophes(text: string): string {
  return text.replace(/(\p{L})'(\p{L})/gu, "$1\u2019$2");
}

export function OgImageTemplate({ title, logoSrc, thumbnailSrc }: OgImageProps) {
  const colors = thumbnailSrc ? ON_IMAGE : PLAIN;
  // Two lines at most: about 24 characters a line at 76px, 30 at 60px.
  const fontSize = title.length > 40 ? 60 : 76;

  // Logo top left, the title alone at the bottom. Over a thumbnail, a
  // gradient at each end keeps the logo and the title legible.
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: PLAIN.background,
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
        <div
          style={{
            display: "block",
            color: colors.foreground,
            fontFamily: "Inter",
            fontSize,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            lineClamp: 2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
