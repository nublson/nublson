export interface CardItemProps {
  title: string;
  description?: string;
  path: string;
}

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export interface PostProps {
  id: string;
  post_slug: string;
  thumbnail: string;
  title: string;
  description: string;
  category: string;
  path?: string;
}
