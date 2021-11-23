import { RiInstagramLine, RiUnsplashLine, RiYoutubeLine } from "react-icons/ri";
import { Container } from "./styles";

import { Texts } from "../../atoms";

function Footer() {
  return (
    <Container>
      <Texts.Small content="Follow me on" />

      <div className="icons">
        <a
          href="https://instagram.com/nublson"
          target="_blank"
          rel="noreferrer"
        >
          <RiInstagramLine />
        </a>
        <a
          href="https://www.youtube.com/channel/UC0kP3MzeS1re1XqQ7ebKIrA"
          target="_blank"
          rel="noreferrer"
        >
          <RiYoutubeLine />
        </a>
        <a
          href="https://unsplash.com/@nublson"
          target="_blank"
          rel="noreferrer"
        >
          <RiUnsplashLine />
        </a>
      </div>
    </Container>
  );
}

export default Footer;
