namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    PORT: string;
    BASE_URL: string;
    NOTION_ACCESS_TOKEN: string;
    NOTION_DATABASE_ARTICLES_ID: string;
    NOTION_DATABASE_PRODUCTS_ID: string;
    NOTION_DATABASE_VIDEOS_ID: string;
    NOTION_DATABASE_NEWSLETTER_ID: string;
    NOTION_DATABASE_GEARS_ID: string;
    NOTION_PAGE_GEARS_ID: string;
    NEXT_PUBLIC_GA_TRACKING_ID: string;
  }
}
