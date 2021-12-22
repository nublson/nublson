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
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN,
    SENDGRID_MAIL_FROM: process.env.SENDGRID_MAIL_FROM,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    SENDGRID_LIST_KEY: process.env.SENDGRID_LIST_KEY,
  },
  images: {
    domains: ["s3.us-west-2.amazonaws.com", "images.unsplash.com"],
  },
};
