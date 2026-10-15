import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  return (
    <header className="wrapper flex items-center justify-between gap-4 pt-8 pb-14 max-md:pt-6 max-md:pb-12">
      <Link href="/" aria-label="Go to homepage" className="shrink-0 rounded-sm">
        <Image
          src="/logo.svg"
          alt=""
          width={24}
          height={24}
          className="dark:invert"
          loading="eager"
        />
      </Link>

      <ThemeToggle />
    </header>
  );
};
