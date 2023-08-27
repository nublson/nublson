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
  description: string;
  category: string;
  publish_date: string;
  modified_date: string;
  path?: string;
}

export interface VideoProps {
  id: string;
  post_slug: string;
  thumbnail: string;
  title: string;
  category: string;
  publish_date: string;
  path?: string;
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
  type?: "articles" | "products" | "videos";
  post: PostProps | VideoProps;
  blurData?: string;
}

export interface MetadataProps {
  params: { slug: string };
}
