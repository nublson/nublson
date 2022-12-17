namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    BASE_URL: string;
    NOTION_ACCESS_TOKEN: string;
    NOTION_DATABASE_ARTICLES_ID: string;
    NOTION_DATABASE_PRODUCTS_ID: string;
    NOTION_DATABASE_BOOKS_ID: string;
    NOTION_PAGE_ABOUT_ID: string;
    NOTION_PAGE_GEARS_ID: string;
    NOTION_PAGE_AFFILIATES_ID: string;
    NOTION_PAGE_NEWSLETTER_ID: string;
    REVUE_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_DATABASE_URL: string;
    NEXT_PUBLIC_GA_TRACKING_ID: string;
    BUY_ME_A_COFFEE_ACCESS_TOKEN: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
