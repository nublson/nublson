import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper mt-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-10 text-sm text-subtle-foreground">
      <span>© {currentYear} Nubelson Fernandes</span>
      <nav aria-label="Footer navigation">
        <NavigationList items={navigation.footer} />
      </nav>
    </footer>
  );
};
