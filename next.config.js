/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,
    NOTION_DATABASE_ARTICLES_ID: process.env.NOTION_DATABASE_ARTICLES_ID,
    NOTION_DATABASE_PRODUCTS_ID: process.env.NOTION_DATABASE_PRODUCTS_ID,
    NOTION_PAGE_GEARS_ID: process.env.NOTION_PAGE_GEARS_ID,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  },
};

module.exports = nextConfig;
