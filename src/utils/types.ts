import { LinkProps } from "next/link";
import { HTMLAttributes, ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
}

export type IBlogCategory = {
  id: string;
  name: string;
};

export type IBlogItem = {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  publish_date: string;
  modified_date?: string;
  read_time: number;
  categories: IBlogCategory[];
  slug: string;
  link?: string;
};

export type IIssueItem = {
  id: number;
  title: string;
  description: string;
  publish_date: string;
  url: string;
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
  link: string;
  stats: string;
}

export interface IBlogCard extends ICardsProps {
  thumbnail: string | StaticImageData;
  publish_date: string;
  read_time: number;
  slug: string;
}

export interface IIssueCard extends ICardsProps {
  publish_date: string;
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
  top: string;
  title: string;
  subtitle?: string;
  image: string | StaticImageData;
  article?: boolean;
}

export interface IInputProps extends HTMLAttributes<HTMLInputElement> {
  name: string;
}

export interface IKitProps {
  kitUrl: string;
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
