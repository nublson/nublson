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
    ];
  },
  images: {
    domains: [
      "s3.amazonaws.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "s3.us-west-2.amazonaws.com",
      "prod-files-secure.s3.us-west-2.amazonaws.com",
    ],
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
    NOTION_DATABASE_ARTICLES_ID: process.env.NOTION_DATABASE_ARTICLES_ID,
    NOTION_DATABASE_PRODUCTS_ID: process.env.NOTION_DATABASE_PRODUCTS_ID,
    NOTION_DATABASE_VIDEOS_ID: process.env.NOTION_DATABASE_VIDEOS_ID,
    NOTION_DATABASE_NEWSLETTER_ID: process.env.NOTION_DATABASE_NEWSLETTER_ID,
    NOTION_DATABASE_GEARS_ID: process.env.NOTION_DATABASE_GEARS_ID,
    NOTION_DATABASE_BOOKS_ID: process.env.NOTION_DATABASE_BOOKS_ID,
    NOTION_PAGE_GEARS_ID: process.env.NOTION_PAGE_GEARS_ID,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_GOOGLE_ID: process.env.NEXT_PUBLIC_GOOGLE_ID,
  },
};

export default withPlaiceholder(nextConfig);
