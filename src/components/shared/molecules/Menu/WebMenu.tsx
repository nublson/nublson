import { navItems } from "../../../../utils/navItems";
import { NavItems } from "./renderItems";
import { WebContainer } from "./styles";

export const WebMenu = () => {
  return <WebContainer>{<NavItems items={navItems} />}</WebContainer>;
};
