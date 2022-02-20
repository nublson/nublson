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
      NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
      NOTION_ABOUT_ID: process.env.NOTION_ABOUT_ID,
      NOTION_GEARS_ID: process.env.NOTION_GEARS_ID,
      UNSPLASH_ACCESS_TOKEN: process.env.UNSPLASH_ACCESS_TOKEN,
      UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
      GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
      REVUE_API_KEY: process.env.REVUE_API_KEY,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      GUMROAD_OVERLAY_CHECKOUT: process.env.GUMROAD_OVERLAY_CHECKOUT,
      NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
      SPOTIFY_AUTH_CODE: process.env.SPOTIFY_AUTH_CODE,
      SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
      INSTAGRAM_FOLLOWERS: process.env.INSTAGRAM_FOLLOWERS,
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
      removeConsole: true,
    },
    swcMinify: true,
  })
);
