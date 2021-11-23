import { Texts } from "../../atoms";

import { Container } from "./styles";

import { navItems } from "../../../../utils/navItems";

const NavMenu = () => {
  return (
    <Container>
      <ul>
        {navItems.map((item, index) => (
          <li key={index}>
            <Texts.Medium content={item.name} />
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default NavMenu;
