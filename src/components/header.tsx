import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export const Header = () => {
  return (
    <header className="wrapper flex items-center justify-between gap-4 py-3">
      <Link href="/" aria-label="Go to homepage" className="shrink-0">
        <Image
          src="/logo.svg"
          alt=""
          width={32}
          height={32}
          className="dark:invert"
          loading="eager"
        />
      </Link>

      <ThemeToggle />
    </header>
  );
};
