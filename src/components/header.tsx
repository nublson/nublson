import navigation from "@/data/navigation.json";
import social from "@/data/social.json";
import { RiGithubLine, RiMailOpenLine, RiYoutubeLine } from "@remixicon/react";
import { Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavigationList } from "./navigation-list";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export const Header = () => {
  const headerNavigation = navigation.header;
  const socialMedia = social.media;

  return (
    <header className="wrapper py-3 flex items-center justify-between">
      <div className="flex items-center justify-start gap-5">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="dark:invert"
          />
        </Link>
        <Separator
          orientation="vertical"
          className="h-5 data-vertical:self-center"
        />
        <nav>
          <NavigationList items={headerNavigation} />
        </nav>
      </div>

      <div className="flex items-center justify-end gap-5">
        <div className="flex items-center justify-end gap-3">
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
              >
                {item.icon === "RiYoutubeLine" && (
                  <RiYoutubeLine size={iconSize} className={iconStyle} />
                )}
                {item.icon === "RiMailOpenLine" && (
                  <RiMailOpenLine size={iconSize} className={iconStyle} />
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
        <Button
          disabled
          aria-label="Toggle theme"
          variant="ghost"
          size="icon"
          className="hidden lg:block"
        >
          <Sun />
        </Button>
      </div>
    </header>
  );
};
