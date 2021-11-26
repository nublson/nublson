import { useEffect } from "react";
import { useRouter } from "next/router";
import { Texts, RouteLink } from "../../atoms";

import { Container, ScrollLink } from "./styles";

import { navItems } from "../../../../utils/navItems";

const NavMenu = () => {
  const { pathname } = useRouter();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <Container>
      <ul>
        {navItems.map((item, index) => {
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
      </ul>
    </Container>
  );
};

export default NavMenu;
