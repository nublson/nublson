export type PurlTokens = {
  accessToken: string;
  refreshToken?: string;
  /** Epoch milliseconds. */
  expiresAt: number;
};

export type PurlPending = {
  state: string;
  verifier: string;
  returnPath: string;
  url: string;
};

export type PurlResult =
  | { status: "saved" }
  | { status: "limit" }
  | { status: "error"; message: string };

const TOKENS_KEY = "purl:tokens";
const PENDING_KEY = "purl:pending";
const RESULT_KEY = "purl:result";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function read(storage: () => Storage, key: string): unknown {
  try {
    const raw = storage().getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(storage: () => Storage, key: string, value: unknown): boolean {
  try {
    storage().setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function remove(storage: () => Storage, key: string): void {
  try {
    storage().removeItem(key);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}

function take(storage: () => Storage, key: string): unknown {
  const value = read(storage, key);
  remove(storage, key);
  return value;
}

const local = () => localStorage;
const session = () => sessionStorage;

export function getTokens(): PurlTokens | null {
  const value = read(local, TOKENS_KEY);
  if (
    !isRecord(value) ||
    typeof value.accessToken !== "string" ||
    typeof value.expiresAt !== "number"
  ) {
    return null;
  }
  return {
    accessToken: value.accessToken,
    refreshToken:
      typeof value.refreshToken === "string" ? value.refreshToken : undefined,
    expiresAt: value.expiresAt,
  };
}

export function setTokens(tokens: PurlTokens): boolean {
  return write(local, TOKENS_KEY, tokens);
}

export function clearTokens(): void {
  remove(local, TOKENS_KEY);
}

export function setPending(pending: PurlPending): boolean {
  return write(session, PENDING_KEY, pending);
}

export function takePending(): PurlPending | null {
  const value = take(session, PENDING_KEY);
  if (
    !isRecord(value) ||
    typeof value.state !== "string" ||
    typeof value.verifier !== "string" ||
    typeof value.returnPath !== "string" ||
    typeof value.url !== "string"
  ) {
    return null;
  }
  return {
    state: value.state,
    verifier: value.verifier,
    returnPath: value.returnPath,
    url: value.url,
  };
}

export function setResult(result: PurlResult): void {
  write(session, RESULT_KEY, result);
}

export function takeResult(): PurlResult | null {
  const value = take(session, RESULT_KEY);
  if (!isRecord(value)) return null;
  if (value.status === "saved") return { status: "saved" };
  if (value.status === "limit") return { status: "limit" };
  if (value.status === "error" && typeof value.message === "string") {
    return { status: "error", message: value.message };
  }
  return null;
}
