import { useRouter } from "next/router";
import Image from "next/image";
import logo from "../../../../assets/img/logo_white.svg";
import { Container } from "./styles";
import { RouteLink } from "../../atoms";

import Menu from "../Menu";

function Header() {
  const { pathname } = useRouter();

  return (
    <Container>
      {pathname === "/" ? (
        <Image src={logo} alt="NUBL logo" width="50" height="50" />
      ) : (
        <RouteLink href="/">
          <Image src={logo} alt="NUBL logo" width="50" height="50" />
        </RouteLink>
      )}

      <Menu />
    </Container>
  );
}

export default Header;
