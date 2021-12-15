/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    NOTION_ACCESS_TOKEN: process.env.NOTION_ACCESS_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    NOTION_ABOUT_ID: process.env.NOTION_ABOUT_ID,
    UNSPLASH_ACCESS_TOKEN: process.env.UNSPLASH_ACCESS_TOKEN,
    UNSPLASH_SECRET_KEY: process.env.UNSPLASH_SECRET_KEY,
    YOUTUBE_ACCESS_TOKEN: process.env.YOUTUBE_ACCESS_TOKEN,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
  },
  images: {
    domains: ["s3.us-west-2.amazonaws.com", "images.unsplash.com"],
  },
};
