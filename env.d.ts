namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    BASE_URL: string;
    NOTION_ACCESS_TOKEN: string;
    NOTION_DATABASE_ID: string;
    NOTION_ABOUT_ID: string;
    UNSPLASH_ACCESS_TOKEN: string;
    UNSPLASH_SECRET_KEY: string;
    YOUTUBE_API_KEY: string;
    YOUTUBE_CHANNEL_ID: string;
    GITHUB_ACCESS_TOKEN: string;
    SENDGRID_MAIL_FROM: string;
    SENDGRID_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_DATABASE_URL: string;
  }
}
