/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
    fallbacks: {
      image: "/static/images/fallback.png",
    },
  },
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    NOTION_ABOUT_ID: process.env.NOTION_ABOUT_ID,
    UNSPLASH_ACCESS_TOKEN: process.env.UNSPLASH_ACCESS_TOKEN,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    REVUE_API_KEY: process.env.REVUE_API_KEY,
    SENDGRID_MAIL_FROM: process.env.SENDGRID_MAIL_FROM,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
  },
  images: {
    domains: ["s3.us-west-2.amazonaws.com", "images.unsplash.com"],
  },
});
