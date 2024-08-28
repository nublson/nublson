import withPlaiceholder from "@plaiceholder/next";

/** @type {import('next').NextConfig} */

const nextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: "/blog",
        destination: "/blog/1",
        permanent: true,
      },
      {
        source: "/store",
        destination: "/store/1",
        permanent: true,
      },
      {
        source: "/resources",
        destination: "/resources/1",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,
    NOTION_DATABASE_CONTENT_ID: process.env.NOTION_DATABASE_CONTENT_ID,
    NOTION_DATABASE_GEARS_ID: process.env.NOTION_DATABASE_GEARS_ID,
    NOTION_PAGE_GEARS_ID: process.env.NOTION_PAGE_GEARS_ID,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ID,
  },
};

export default withPlaiceholder(nextConfig);
