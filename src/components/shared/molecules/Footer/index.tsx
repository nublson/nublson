import { useEffect, useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import Texts from "../../atoms/Texts";
import { Container } from "./styles";
import RouteLink from "../../atoms/RouteLink";

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <div className="copy">
          <div className="spotify">
            <RiSpotifyLine className="icon" />
            <Texts.Small content="Not Playing" />
            <Texts.Small content="- Spotify" />
          </div>
          <Texts.Small
            content={`© ${currentYear}, Nubelson Fernandes. With ❤️ and ☕`}
          />
        </div>

        <div className="menu">
          <RouteLink href="/about">
            <Texts.Small content="About" />
          </RouteLink>
          <RouteLink href="/newsletter">
            <Texts.Small content="Newsletter" />
          </RouteLink>
          <RouteLink href="/gears">
            <Texts.Small content="Video &#38; Photo Setup" />
          </RouteLink>
        </div>
      </div>
    </Container>
  );
}

export default Footer;
