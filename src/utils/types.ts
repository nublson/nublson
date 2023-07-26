export interface CardItemProps {
  title: string;
  description?: string;
  path: string;
}

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export interface PageProps {
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

export interface DynamicPageProps {
  params: {
    slug: string;
  };
}

export interface GearProps {
  image: string;
  name: string;
  description: string;
  blurData?: string;
}

export interface GearsCategoryProps {
  title: string;
  gears: GearProps[];
}

export interface PostCardProps {
  type: "articles" | "products";
  post: PageProps;
  blurData?: string;
}

export interface MetadataProps {
  params: { slug: string };
}
