import { useEffect, useState } from "react";
import Texts from "../../atoms/Texts";
import { Container } from "./styles";

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <Texts.Small content="With ❤️ and ☕" />

        <Texts.Small content={`© ${currentYear}, Nubelson Fernandes`} />
      </div>
    </Container>
  );
}

export default Footer;
