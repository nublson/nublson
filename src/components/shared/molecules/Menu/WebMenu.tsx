import { WebContainer } from "./styles";
import { NavItems } from "./renderItems";
import { navItems } from "../../../../utils/navItems";

export const WebMenu = () => {
  return <WebContainer>{<NavItems items={navItems} />}</WebContainer>;
};
