type LinksetLink = {
  href: string;
  type?: string;
};

type LinksetEntry = {
  anchor: string;
  "service-desc"?: LinksetLink[];
  "service-doc"?: LinksetLink[];
};

export type ApiCatalog = {
  linkset: LinksetEntry[];
};

export function buildApiCatalog(baseUrl: string): ApiCatalog {
  const base = baseUrl.replace(/\/$/, "");

  return {
    linkset: [
      {
        anchor: `${base}/api/markdown`,
        "service-desc": [
          { href: `${base}/openapi.json`, type: "application/openapi+json" },
        ],
        "service-doc": [{ href: `${base}/llms.txt`, type: "text/plain" }],
      },
      {
        anchor: `${base}/api/mcp`,
        "service-desc": [
          {
            href: `${base}/.well-known/mcp/server-card.json`,
            type: "application/json",
          },
        ],
        "service-doc": [{ href: `${base}/agents.txt`, type: "text/plain" }],
      },
    ],
  };
}
