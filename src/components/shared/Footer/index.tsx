import { IconContext } from "react-icons";
import { RiInstagramLine, RiYoutubeLine, RiUnsplashLine } from "react-icons/ri";
import { Container } from "./styles";

function Footer() {
  return (
    <Container>
      <p>Follow me on</p>

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
