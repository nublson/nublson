import { getPurlConfig } from "./config";
import { refreshTokens, startConnect } from "./oauth";
import { clearTokens, getTokens, type PurlTokens } from "./storage";

const REQUEST_TIMEOUT_MS = 15_000;
export const PURL_LIMIT_MESSAGE =
  "Purl link limit reached. Remove a saved link to add more.";

const LIMIT_REACHED_CODE = "LIMIT_REACHED";

const CONNECTION_MESSAGE =
  "Couldn't save to Purl. Check your connection and try again.";
const TIMEOUT_MESSAGE =
  "Couldn't save to Purl. The request timed out — try again.";
const CONNECT_UNAVAILABLE_MESSAGE =
  "Couldn't connect to Purl. Check your browser settings and try again.";

export type PurlSaveOutcome =
  | { status: "saved" }
  | { status: "limit" }
  | { status: "redirecting" }
  | { status: "error"; message: string };

export class PurlNotConnectedError extends Error {
  constructor() {
    super("Not connected to Purl");
    this.name = "PurlNotConnectedError";
  }
}

export class PurlRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PurlRequestError";
  }
}

async function renewTokens(signal?: AbortSignal): Promise<PurlTokens> {
  const tokens = await refreshTokens(signal);
  if (!tokens) {
    clearTokens();
    throw new PurlNotConnectedError();
  }
  return tokens;
}

function postSave(
  url: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<Response> {
  return fetch(getPurlConfig().saveUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url }),
    signal,
  });
}

async function readBody(res: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await res.json();
    return typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export async function saveLink(
  url: string,
  signal?: AbortSignal,
): Promise<"saved" | "limit"> {
  let tokens = getTokens();
  if (!tokens) throw new PurlNotConnectedError();
  if (tokens.expiresAt <= Date.now()) tokens = await renewTokens(signal);

  let res = await postSave(url, tokens.accessToken, signal);
  if (res.status === 401) {
    tokens = await renewTokens(signal);
    res = await postSave(url, tokens.accessToken, signal);
    if (res.status === 401) {
      clearTokens();
      throw new PurlNotConnectedError();
    }
  }

  if (res.ok) return "saved";

  const body = await readBody(res);
  if (res.status === 403) {
    if (body.code === LIMIT_REACHED_CODE) return "limit";
    clearTokens();
    throw new PurlNotConnectedError();
  }
  throw new PurlRequestError(
    typeof body.error === "string" ? body.error : CONNECTION_MESSAGE,
  );
}

/**
 * One save attempt shaped for the button: never throws. Pass `connect: false`
 * where redirecting to Purl again would be wrong (the OAuth callback itself).
 */
export async function saveToPurl(
  url: string,
  options: { connect?: boolean } = {},
): Promise<PurlSaveOutcome> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return { status: await saveLink(url, controller.signal) };
  } catch (e) {
    if (e instanceof PurlNotConnectedError) {
      if (options.connect === false) {
        return { status: "error", message: CONNECT_UNAVAILABLE_MESSAGE };
      }
      return (await startConnect(url))
        ? { status: "redirecting" }
        : { status: "error", message: CONNECT_UNAVAILABLE_MESSAGE };
    }
    if ((e as { name?: string } | null)?.name === "AbortError") {
      return { status: "error", message: TIMEOUT_MESSAGE };
    }
    return {
      status: "error",
      message: e instanceof PurlRequestError ? e.message : CONNECTION_MESSAGE,
    };
  } finally {
    clearTimeout(timeout);
  }
}
