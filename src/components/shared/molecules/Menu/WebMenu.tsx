import nav from "../../../../utils/navItems.json";
import { NavItems } from "./renderItems";
import { WebContainer } from "./styles";

export const WebMenu = () => {
  return <WebContainer>{<NavItems items={nav.items} />}</WebContainer>;
};
