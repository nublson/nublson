/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withPWA({
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      disable: process.env.NODE_ENV === "development",
      fallbacks: {
        image: "/static/images/fallback.webp",
      },
    },
    reactStrictMode: true,
    env: {
      BASE_URL: process.env.BASE_URL,
      NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,
      NOTION_DATABASE_ARTICLES_ID: process.env.NOTION_DATABASE_ARTICLES_ID,
      NOTION_DATABASE_PRODUCTS_ID: process.env.NOTION_DATABASE_PRODUCTS_ID,
      NOTION_DATABASE_BOOKS_ID: process.env.NOTION_DATABASE_BOOKS_ID,
      NOTION_PAGE_ABOUT_ID: process.env.NOTION_PAGE_ABOUT_ID,
      NOTION_PAGE_GEARS_ID: process.env.NOTION_PAGE_GEARS_ID,
      NOTION_PAGE_AFFILIATES_ID: process.env.NOTION_PAGE_AFFILIATES_ID,
      REVUE_API_KEY: process.env.REVUE_API_KEY,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      BUY_ME_A_COFFEE_ACCESS_TOKEN: process.env.BUY_ME_A_COFFEE_ACCESS_TOKEN,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    },
    images: {
      minimumCacheTTL: 60,
      domains: [
        "s3.us-west-2.amazonaws.com",
        "images.unsplash.com",
        "res.cloudinary.com",
      ],
    },
    compiler: {
      styledComponents: true,
      // removeConsole: true,
    },
    swcMinify: true,
  })
);
