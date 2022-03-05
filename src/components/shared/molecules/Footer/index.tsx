import { useEffect, useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import { useMusic } from "../../../../hooks/useSpotify";
import nav from "../../../../utils/navMenu.json";
import RouteLink from "../../atoms/RouteLink";
import { SmallText } from "../../atoms/Texts";
import { Container } from "./styles";
import { useRouter } from "next/router";

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);
  const player = useMusic();
  const { pathname } = useRouter();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <div className="spotify">
          <RiSpotifyLine className="icon" />
          {player?.isPlaying ? (
            <a href={player.songUrl} target="_blank" rel="noreferrer">
              <SmallText content={`${player.title}`} />
            </a>
          ) : (
            <SmallText content="Not Playing" />
          )}
          <SmallText content="on Spotify" />
        </div>

        <ul className="menu">
          {nav.footer.items.map((item) => (
            <li
              key={item.path}
              className={pathname === `/${item.path}` ? "active" : ""}
            >
              <RouteLink href={`/${item.path}`}>
                <SmallText content={item.name} />
              </RouteLink>
            </li>
          ))}
        </ul>
        <SmallText content={`© ${currentYear}, Nubelson Fernandes`} />
      </div>
    </Container>
  );
}

export default Footer;
