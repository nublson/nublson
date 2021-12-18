import { useRouter } from "next/router";
import { Link } from "react-scroll";
import RouteLink from "../../atoms/RouteLink";
import Texts from "../../atoms/Texts";
import { StyledItem } from "./styles";

interface ItemsProps {
  items: {
    name: string;
    path: string;
  }[];
  scrollAction?(): any;
}

export const NavItems = ({ items, scrollAction }: ItemsProps) => {
  const { pathname } = useRouter();

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <StyledItem
            key={index}
            className={pathname === `/${item.path}` ? "active" : ""}
          >
            {item.name === "Contact" ? (
              <Link
                href="#contact"
                to={item.path}
                spy={true}
                smooth={true}
                duration={1000}
                onClick={scrollAction}
              >
                <Texts.Medium content={item.name} />
              </Link>
            ) : (
              <RouteLink href={`/${item.path}`}>
                <Texts.Medium content={item.name} />
              </RouteLink>
            )}
          </StyledItem>
        );
      })}
    </ul>
  );
};
