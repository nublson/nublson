import { cn } from "@/lib/utils";
import { RiGithubFill, RiInstagramLine, RiYoutubeFill } from "@remixicon/react";
import type { AnchorHTMLAttributes, ReactNode, SVGProps } from "react";

/** Substack's mark (Remix Icon has none). */
function SubstackMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

type IconComponent = typeof RiGithubFill | typeof SubstackMark;

const SOCIAL_ICONS: Record<string, { Icon: IconComponent; className: string }> =
  {
    GitHub: { Icon: RiGithubFill, className: "text-foreground" },
    YouTube: { Icon: RiYoutubeFill, className: "text-[#ff0033]" },
    Instagram: { Icon: RiInstagramLine, className: "text-[#e1306c]" },
    Substack: { Icon: SubstackMark, className: "text-[#ff6719]" },
  };

export function SocialIcon({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const entry = SOCIAL_ICONS[label];
  if (!entry) return null;
  return (
    <entry.Icon
      aria-hidden
      className={cn(
        "inline-block size-[13px] shrink-0 align-[-2px]",
        entry.className,
        className,
      )}
    />
  );
}

type FaviconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  label: string;
  children?: ReactNode;
};

/** External profile link shown as "[favicon] Label". */
export function FaviconLink({
  href,
  label,
  children,
  className,
  ...props
}: FaviconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
      className={cn(
        "font-medium text-foreground transition-opacity duration-150 ease-(--ease-out) hover:opacity-70",
        // A bare label stays on one line; longer link text from Notion must wrap.
        !children && "whitespace-nowrap",
        className,
      )}
    >
      <SocialIcon label={label} className="mr-[5px]" />
      {children ?? label}
    </a>
  );
}
