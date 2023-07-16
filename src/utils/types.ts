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
  publish_date: string;
  category: string;
  path?: string;
}

export interface PageProps {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  publish_date: string;
}

export interface DynamicPageProps {
  params: {
    slug: string;
  };
}

interface GearProps {
  image: string;
  name: string;
  description: string;
}

export interface GearsCategoryProps {
  title: string;
  gears: GearProps[];
}

export interface PostCardProps {
  type: "articles" | "products";
  post: PostProps;
}
