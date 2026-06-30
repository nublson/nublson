export type PurlLink = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  favicon: string | null;
  thumbnail: string | null;
  domain: string;
  contentType: "WEB" | "YOUTUBE" | "PDF" | "AUDIO";
  ingestStatus: "PENDING" | "COMPLETED";
  createdAt: string;
};

export type PurlErrorBody = {
  error: string;
  code?: string;
  feature?: string;
};

function getPurlApiBase(): string {
  const base =
    process.env.PURL_URL ??
    process.env.NEXT_PUBLIC_PURL_URL ??
    "https://purl.nublson.com";
  return `${base.replace(/\/$/, "")}/api/v1`;
}

function getPurlApiKey(): string {
  const apiKey = process.env.PURL_API_KEY;
  if (!apiKey) {
    throw new Error("PURL_API_KEY is not configured");
  }
  return apiKey;
}

export class PurlApiError extends Error {
  readonly status: number;
  readonly body: PurlErrorBody | null;

  constructor(status: number, body: PurlErrorBody | null) {
    super(body?.error ?? `Purl API request failed (${status})`);
    this.name = "PurlApiError";
    this.status = status;
    this.body = body;
  }
}

export async function savePurlLink(url: string): Promise<PurlLink> {
  const res = await fetch(`${getPurlApiBase()}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getPurlApiKey()}`,
    },
    body: JSON.stringify({ url }),
  });

  const body = (await res.json().catch(() => null)) as
    | PurlLink
    | PurlErrorBody
    | null;

  if (!res.ok) {
    throw new PurlApiError(
      res.status,
      body && "error" in body ? body : null,
    );
  }

  return body as PurlLink;
}
