import navigation from "@/data/navigation.json";
import { NavigationList } from "./navigation-list";
import { Typography } from "./typography";
import { Separator } from "./ui/separator";

export const Footer = () => {
  const footerNavigation = navigation.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="wrapper flex flex-col items-center justify-start gap-5 pb-5 mt-10">
      <Separator />
      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-2.5">
        <Typography size="small">
          © Nubelson Fernandes | {currentYear}
        </Typography>

        <NavigationList items={footerNavigation} className="font-normal" />
      </div>
    </footer>
  );
};
