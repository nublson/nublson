import { useEffect, useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import Texts from "../../atoms/Texts";
import { Container } from "./styles";
import RouteLink from "../../atoms/RouteLink";
import useSWR from "swr";
import { api } from "../../../../services/api";

interface MusicProps {
  isPlaying: boolean;
  title: string;
  songUrl: string;
}

const fetchMusic = async (url: string) => {
  const response = await api.get(url);

  return response.data;
};

function Footer() {
  const [currentYear, setCurrentYear] = useState(2022);
  const { data } = useSWR<MusicProps>("/spotify/playing", fetchMusic, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Container>
      <div className="content">
        <div className="copy">
          <div className="spotify">
            <RiSpotifyLine className="icon" />
            {data?.isPlaying ? (
              <a href={data.songUrl} target="_blank" rel="noreferrer">
                <Texts.Small content={`${data.title}`} />
              </a>
            ) : (
              <Texts.Small content="Not Playing" />
            )}
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
