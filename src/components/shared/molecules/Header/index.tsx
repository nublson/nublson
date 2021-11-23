import Image from "next/image";
import logo from "../../../../assets/img/logo_white.svg";
import { Container } from "./styles";

import NavMenu from "../NavMenu";

function Header() {
  return (
    <Container>
      <Image src={logo} alt="NUBL logo" width="50" height="50" />

      <NavMenu />
    </Container>
  );
}

export default Header;
