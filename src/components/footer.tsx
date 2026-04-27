import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";

export const Footer = () => {
  const footerNavigation = navigation.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper flex items-center justify-between py-5">
      <p>© Nubelson Fernandes | {currentYear}</p>

      <NavigationList items={footerNavigation} className="font-normal" />
    </footer>
  );
};
