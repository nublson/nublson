export type OgImageData = {
  title: string;
  category?: string;
  thumbnailUrl?: string;
};

export async function resolveOgImageData(
  data: OgImageData,
): Promise<{ title: string; category: string; thumbnailSrc?: string }> {
  const { title, category = "", thumbnailUrl } = data;
  let thumbnailSrc: string | undefined;

  if (thumbnailUrl) {
    try {
      const res = await fetch(thumbnailUrl);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = res.headers.get("content-type") ?? "image/jpeg";
        thumbnailSrc = `data:${mimeType};base64,${base64}`;
      }
    } catch {
      // thumbnail unavailable — fall back to text-only
    }
  }

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

  if (thumbnailSrc) {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${thumbnailSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.9) 100%)",
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        padding: "80px",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {category ? (
          <span
            style={{
              color: "#888888",
              fontSize: "26px",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
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
            margin: 0,
            maxWidth: "1000px",
          }}
        >
          {title}
        </h1>
      </div>
      <span
        style={{
          color: "#555555",
          fontSize: "28px",
          fontFamily: "sans-serif",
        }}
      >
        nublson.com
      </span>
    </div>
  );
}
