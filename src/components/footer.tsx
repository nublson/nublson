import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";

/**
 * Links first, then the copyright: stacked on phones, where the two don't
 * fit on one line, and side by side (copyright on the left) from 480px.
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper mt-16 flex flex-col gap-3 pb-10 text-sm text-subtle-foreground min-[480px]:flex-row-reverse min-[480px]:items-center min-[480px]:justify-between min-[480px]:gap-4">
      <nav aria-label="Footer navigation">
        <NavigationList items={navigation.footer} />
      </nav>
      <span>© {currentYear} Nubelson Fernandes</span>
    </footer>
  );
};
