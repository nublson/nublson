import { Texts } from "../../atoms";

import { Container, ScrollLink } from "./styles";

import { navItems } from "../../../../utils/navItems";

const NavMenu = () => {
  return (
    <Container>
      <ul>
        {navItems.map((item, index) => {
          return (
            <li key={index}>
              {item.name === "Contact" ? (
                <ScrollLink
                  to={item.path}
                  spy={true}
                  smooth={true}
                  duration={1000}
                >
                  <Texts.Medium content={item.name} />
                </ScrollLink>
              ) : (
                <Texts.Medium content={item.name} />
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
};

export default NavMenu;
