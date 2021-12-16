import Image from "next/image";
import logo from "../../../../assets/img/logo_white.svg";
import Menu from "../Menu";
import { Container } from "./styles";

function Header() {
  return (
    <Container>
      <div className="content">
        <Image
          src={logo}
          alt="NUBL logo"
          width="50"
          height="50"
          className="logo"
        />

        <Menu />
      </div>
    </Container>
  );
}

export default Header;
