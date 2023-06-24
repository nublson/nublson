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
  image: string;
  title: string;
  path: string;
  category: string;
}
