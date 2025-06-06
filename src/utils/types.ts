export interface CardItemProps {
  title: string;
  description?: string;
  path: string;
}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export interface PostProps {
  id: string;
  post_slug: string;
  thumbnail: string;
  title: string;
  description?: string;
  keywords?: string[];
  category?: string;
  publish_date: string;
  modified_date?: string;
  path?: string;
  author?: string;
  price?: number;
  pageNumber?: number;
}

export interface PostCardItemProps {
  id: string;
  title: string;
  thumbnail: string;
  publish_date: string;
  path: string;
}

export interface GearProps {
  id?: string;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
  blurData?: string;
  path?: string;
}

export interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export interface PostCardProps {
  type?: "blog" | "store" | "videos" | "newsletter" | "books";
  post: PostCardItemProps;
  blurData?: string;
}
