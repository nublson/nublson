import type { NextConfig } from "next";

const CORS_DISCOVERY_PATHS = [
  "/openapi.json",
  "/auth.md",
  "/.well-known/agent-skills/:path*",
  "/.well-known/agent-skills.json",
  "/.well-known/agent.json",
  "/.well-known/mcp.json",
  "/.well-known/mcp/:path*",
];

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/writings",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/writings/:path*",
        permanent: true,
      },
      {
        source: "/work",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/work/:path*",
        destination: "/projects/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    // Static agent-discovery files must be readable by browser-embedded
    // agents cross-origin (the dynamic agents.txt/agents.json routes
    // already send this header themselves).
    return CORS_DISCOVERY_PATHS.map((source) => ({
      source,
      headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
    }));
  },
  images: {
    // Proxy serves bytes from Notion; allow optimization of local /api paths.
    localPatterns: [
      {
        pathname: "/logo.svg",
        search: "",
      },
      {
        // Omit `search` so any query string is allowed (ids + cache-buster).
        pathname: "/api/notion-image",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.notionusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
    ],
  },
};

export default nextConfig;
