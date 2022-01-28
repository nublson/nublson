import nav from "../../../../utils/navMenu.json";
import { NavItems } from "./renderItems";
import { WebContainer } from "./styles";

export const WebMenu = () => {
  return <WebContainer>{<NavItems items={nav.header.items} />}</WebContainer>;
};
