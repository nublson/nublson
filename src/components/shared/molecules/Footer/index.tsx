import { useEffect, useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import { useMusic } from "../../../../hooks/useSpotify";
import nav from "../../../../utils/navMenu.json";
import RouteLink from "../../atoms/RouteLink";
import { SmallText } from "../../atoms/Texts";
import { Container } from "./styles";

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);
  const player = useMusic();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <div className="copy">
          <div className="spotify">
            <RiSpotifyLine className="icon" />
            {player?.isPlaying ? (
              <a href={player.songUrl} target="_blank" rel="noreferrer">
                <SmallText content={`${player.title}`} />
              </a>
            ) : (
              <SmallText content="Not Playing" />
            )}
            <SmallText content="- Spotify" />
          </div>
          <SmallText
            content={`© ${currentYear}, Nubelson Fernandes. With ❤️ and ☕`}
          />
        </div>

        <div className="menu">
          {nav.footer.items.map((item) => (
            <RouteLink key={item.path} href={`/${item.path}`}>
              <SmallText content={item.name} />
            </RouteLink>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Footer;
