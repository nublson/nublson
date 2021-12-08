import { useRouter } from "next/router";
import { RouteLink, Texts } from "../../atoms";
import { ScrollLink, StyledItems } from "./styles";

interface ItemsProps {
  items: {
    name: string;
    path: string;
  }[];
}

export const NavItems = ({ items }: ItemsProps) => {
  const { pathname } = useRouter();

  return (
    <StyledItems>
      {items.map((item, index) => {
        return (
          <li
            key={index}
            className={pathname === `/${item.path}` ? "active" : ""}
          >
            {item.name === "Contact" ? (
              <ScrollLink
                to={item.path}
                spy={true}
                smooth={true}
                duration={1000}
              >
                <Texts.Medium content={item.name} />
              </ScrollLink>
            ) : item.name === "Work" ? (
              pathname === "/" ? (
                <ScrollLink
                  to={item.path}
                  spy={true}
                  smooth={true}
                  duration={1000}
                >
                  <Texts.Medium content={item.name} />
                </ScrollLink>
              ) : (
                <RouteLink href={`/#${item.path}`}>
                  <Texts.Medium content={item.name} />
                </RouteLink>
              )
            ) : (
              <RouteLink href={`/${item.path}`}>
                <Texts.Medium content={item.name} />
              </RouteLink>
            )}
          </li>
        );
      })}
    </StyledItems>
  );
};
