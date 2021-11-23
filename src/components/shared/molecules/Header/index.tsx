import Image from "next/image";

import logoWhite from "../../../../assets/img/logo_white.svg";

import { Container } from "./styles";

function Header() {
  return (
    <Container>
      <Image src={logoWhite} alt="nublson logo" width={50} height={50} />
    </Container>
  );
}

export default Header;
