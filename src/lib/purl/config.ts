const DEFAULT_PURL_URL = "https://purl.live";

export type PurlConfig = {
  baseUrl: string;
  clientId: string | null;
  authorizeUrl: string;
  tokenUrl: string;
  saveUrl: string;
  scope: string;
  redirectUri: string;
};

export function getPurlConfig(): PurlConfig {
  const baseUrl = (process.env.NEXT_PUBLIC_PURL_URL || DEFAULT_PURL_URL).replace(
    /\/$/,
    "",
  );
  return {
    baseUrl,
    clientId: process.env.NEXT_PUBLIC_PURL_CLIENT_ID || null,
    authorizeUrl: `${baseUrl}/api/auth/mcp/authorize`,
    tokenUrl: `${baseUrl}/api/auth/mcp/token`,
    saveUrl: `${baseUrl}/api/v1/links/save`,
    scope: "links:save offline_access",
    redirectUri: `${window.location.origin}/purl/callback`,
  };
}
