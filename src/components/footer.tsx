import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";
import { Typography } from "./typography";

export const Footer = () => {
  const footerNavigation = navigation.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper flex items-center justify-between py-5">
      <Typography size="small" className="text-foreground">
        © Nubelson Fernandes | {currentYear}
      </Typography>

      <NavigationList items={footerNavigation} className="font-normal" />
    </footer>
  );
};
