import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../../../assets/img/logo_white.svg";
import RouteLink from "../../atoms/RouteLink";
import Menu from "../Menu";
import { Container } from "./styles";

function Header() {
  const { pathname } = useRouter();

  return (
    <Container>
      <div className="content">
        {pathname === "/" ? (
          <Image
            src={logo}
            alt="NUBL logo"
            width="50"
            height="50"
            className="logo"
          />
        ) : (
          <RouteLink href={"/"}>
            <Image
              src={logo}
              alt="NUBL logo"
              width="50"
              height="50"
              className="logo"
            />
          </RouteLink>
        )}

        <Menu />
      </div>
    </Container>
  );
}

export default Header;
