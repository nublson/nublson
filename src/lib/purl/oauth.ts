import { getPurlConfig } from "./config";
import { createChallenge, createState, createVerifier } from "./pkce";
import {
  getTokens,
  setPending,
  setTokens,
  takePending,
  type PurlTokens,
} from "./storage";

const CONNECT_FAILED_MESSAGE =
  "Couldn't finish connecting to Purl. Try saving again.";
const DENIED_MESSAGE = "Purl access was not allowed.";
/** Treat tokens as expired slightly early so a request never races expiry. */
const EXPIRY_SKEW_MS = 30_000;

export class PurlConnectError extends Error {
  readonly returnPath: string;
  /** True when there is nothing worth telling the visitor (e.g. a reloaded callback). */
  readonly quiet: boolean;

  constructor(message: string, returnPath: string, quiet = false) {
    super(message);
    this.name = "PurlConnectError";
    this.returnPath = returnPath;
    this.quiet = quiet;
  }
}

/** The token endpoint was unreachable or failing; the visitor's tokens are still good. */
export class PurlTransientError extends Error {
  constructor() {
    super("Purl is unreachable");
    this.name = "PurlTransientError";
  }
}

/** Only same-site relative paths are allowed as a post-connect destination. */
export function safeReturnPath(path: string | undefined): string {
  // Backslashes and control characters are normalised to "/" by URL parsers
  // (so "/\\evil.com" and "/\t/evil.com" resolve off-site), so reject them.
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  if (/[\\\u0000-\u001f]/.test(path)) return "/";
  return path;
}

export function buildAuthorizeUrl(args: {
  state: string;
  challenge: string;
}): string {
  const config = getPurlConfig();
  const url = new URL(config.authorizeUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", config.clientId ?? "");
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("scope", config.scope);
  url.searchParams.set("state", args.state);
  url.searchParams.set("code_challenge", args.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

/** Resolves `false` (without redirecting) when the flow cannot start. */
export async function startConnect(url: string): Promise<boolean> {
  if (!getPurlConfig().clientId) return false;
  const verifier = createVerifier();
  const state = createState();
  const challenge = await createChallenge(verifier);
  const returnPath = safeReturnPath(
    window.location.pathname + window.location.search,
  );
  if (!setPending({ state, verifier, returnPath, url })) return false;
  window.location.assign(buildAuthorizeUrl({ state, challenge }));
  return true;
}

type TokenResponse = {
  access_token?: unknown;
  refresh_token?: unknown;
  expires_in?: unknown;
};

/**
 * Resolves `null` when Purl rejects the request (bad or revoked grant) and
 * throws `PurlTransientError` when it could not be reached or is failing.
 */
async function requestTokens(
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<PurlTokens | null> {
  const { tokenUrl, clientId } = getPurlConfig();
  if (!clientId) return null;
  try {
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ ...params, client_id: clientId }).toString(),
      signal,
    });
    if (res.status >= 500 || res.status === 429) throw new PurlTransientError();
    if (!res.ok) return null;
    const body = (await res.json()) as TokenResponse;
    if (typeof body.access_token !== "string") return null;
    const expiresIn =
      typeof body.expires_in === "number" ? body.expires_in : 3600;
    return {
      accessToken: body.access_token,
      refreshToken:
        typeof body.refresh_token === "string" ? body.refresh_token : undefined,
      expiresAt: Date.now() + expiresIn * 1000 - EXPIRY_SKEW_MS,
    };
  } catch (e) {
    if (e instanceof PurlTransientError) throw e;
    if ((e as { name?: string } | null)?.name === "AbortError") throw e;
    if (e instanceof TypeError) throw new PurlTransientError();
    return null;
  }
}

export async function completeConnect(
  params: URLSearchParams,
): Promise<{ returnPath: string; url: string }> {
  const pending = takePending();
  if (!pending) throw new PurlConnectError(CONNECT_FAILED_MESSAGE, "/", true);
  const returnPath = safeReturnPath(pending.returnPath);

  if (params.get("state") !== pending.state) {
    throw new PurlConnectError(CONNECT_FAILED_MESSAGE, returnPath);
  }
  if (params.get("error")) {
    throw new PurlConnectError(
      params.get("error") === "access_denied"
        ? DENIED_MESSAGE
        : CONNECT_FAILED_MESSAGE,
      returnPath,
    );
  }
  const code = params.get("code");
  if (!code) throw new PurlConnectError(CONNECT_FAILED_MESSAGE, returnPath);

  let tokens: PurlTokens | null = null;
  try {
    tokens = await requestTokens({
      grant_type: "authorization_code",
      code,
      code_verifier: pending.verifier,
      redirect_uri: getPurlConfig().redirectUri,
    });
  } catch {
    // Unreachable or failing token endpoint: same outcome as a rejected code.
  }
  if (!tokens || !setTokens(tokens)) {
    throw new PurlConnectError(CONNECT_FAILED_MESSAGE, returnPath);
  }
  return { returnPath, url: pending.url };
}

/** `null` when the refresh grant is rejected; throws `PurlTransientError` on network/5xx. */
export async function refreshTokens(
  signal?: AbortSignal,
): Promise<PurlTokens | null> {
  const current = getTokens();
  if (!current?.refreshToken) return null;
  const next = await requestTokens(
    { grant_type: "refresh_token", refresh_token: current.refreshToken },
    signal,
  );
  if (!next) return null;
  const tokens = {
    ...next,
    refreshToken: next.refreshToken ?? current.refreshToken,
  };
  return setTokens(tokens) ? tokens : null;
}
