import navigation from "@/data/navigation.json";
import social from "@/data/social.json";
import { RiGithubLine, RiInstagramLine, RiYoutubeLine } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { NavigationList } from "./navigation-list";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "./ui/separator";

export const Header = () => {
  const headerNavigation = navigation.header;
  const socialMedia = social.media;

  return (
    <header className="wrapper flex items-center justify-between py-3">
      <div className="flex items-center justify-start gap-2.5 md:gap-5">
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            className="dark:invert"
            loading="eager"
          />
        </Link>
        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
        <nav aria-label="Main navigation">
          <NavigationList items={headerNavigation} />
        </nav>
      </div>

      <div className="flex items-center justify-end gap-5">
        <div className="flex items-center justify-end gap-3 md:gap-5">
          {socialMedia.map((item) => {
            const iconStyle =
              "text-muted-foreground hover:text-foreground transition-colors";
            const iconSize = 16;

            return (
              <a
                key={item.label}
                aria-label={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.icon === "RiInstagramLine" && (
                  <RiInstagramLine size={iconSize} className={iconStyle} />
                )}
                {item.icon === "RiYoutubeLine" && (
                  <RiYoutubeLine size={iconSize} className={iconStyle} />
                )}
                {item.icon === "RiGithubLine" && (
                  <RiGithubLine size={iconSize} className={iconStyle} />
                )}
              </a>
            );
          })}
        </div>

        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center hidden lg:block"
        />
        <ThemeToggle />
      </div>
    </header>
  );
};
