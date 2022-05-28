import { LinkProps } from "next/link";
import { HTMLAttributes, ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
}

export type IPostCategory = {
  id: string;
  name: string;
};

export type IBookItem = {
  id: string;
  post_slug: string;
  thumbnail: string;
  title: string;
  description: string;
  author: string;
  publish_date: string;
  categories: IPostCategory[];
  modified_date: string;
  refer_link?: string;
};

export type IPostItem = {
  id: string;
  post_slug: string;
  thumbnail: string;
  title: string;
  description: string;
  amount: string;
  access: "public" | "member_free" | "member_exclusive";
  publish_date: string;
  categories: IPostCategory[];
  modified_date: string;
  member_link?: string;
  refer_link?: string;
};

export type IGalleryItem = {
  id: string;
  url: string;
  alt: string;
  height: number;
  width: number;
};

export type IIssueItem = {
  id: number;
  title: string;
  description: string;
  publish_date: string;
};

export interface ISectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: ReactNode;
}

export interface ICategoryItemProps
  extends HTMLAttributes<HTMLParagraphElement> {
  name: string;
}

export interface IRouteLinkProps extends LinkProps {
  children: ReactNode;
}

export interface IShareLinkProps {
  on: "facebook" | "twitter" | "whatsapp";
  content: string;
  children: ReactNode;
}

export interface ITextsProps {
  content: string;
}

export interface IButtonsProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
}

export interface IButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export interface IGumroadButtonProps {
  productUrl: string;
}

export interface ICardsProps {
  title: string;
  description?: string;
}

export interface IWorkCard extends ICardsProps {
  id: string;
  path: string;
  external: boolean;
}

export interface IPostCard extends ICardsProps {
  slug: string;
  thumbnail: string | StaticImageData;
  publish_date: string;
  amount: string;
}

export interface IIssueCard extends ICardsProps {
  publish_date: string;
}

export interface IBookCard extends ICardsProps {
  author: string;
  categories: IPostCategory[];
}

export interface IViews {
  views: number;
}

export interface IMusicProps {
  isPlaying: boolean;
  title: string;
  songUrl: string;
}

export interface IHeadingProps {
  top?: string;
  title: string;
  subtitle?: string;
  image?: string | StaticImageData;
  article?: boolean;
}

export interface IInputProps extends HTMLAttributes<HTMLInputElement> {
  name: string;
}

export interface IKitProps {
  url: string;
}

export interface IPodcastProps {
  slug: string;
}

export interface IItemsProps {
  items: {
    name: string;
    path: string;
  }[];
  scrollAction?(): any;
}

export interface IGtagProps {
  action: string;
  category: string;
  label: string;
  value: number;
}

export type IPostType = "article" | "product" | "podcast";

export interface IMembersOnlyCardProps {
  member_link: string;
  access: "public" | "member_free" | "member_exclusive";
}

export interface IImageGridProps {
  gallery: IGalleryItem[];
}
