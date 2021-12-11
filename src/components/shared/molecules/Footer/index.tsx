import Texts from "../../atoms/Texts";
import { Container } from "./styles";

function Footer() {
  return (
    <Container>
      <div className="content">
        <Texts.Small content="With ❤️ and ☕" />

        <Texts.Small content="&copy; 2021, Nubelson Fernandes" />
      </div>
    </Container>
  );
}

export default Footer;
