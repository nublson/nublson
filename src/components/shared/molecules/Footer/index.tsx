import { useEffect, useState } from "react";
import { RiSpotifyLine } from "react-icons/ri";
import useSWR from "swr";
import { api } from "../../../../services/api";
import RouteLink from "../../atoms/RouteLink";
import { SmallText } from "../../atoms/Texts";
import { Container } from "./styles";

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
                <SmallText content={`${data.title}`} />
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
          <RouteLink href="/about">
            <SmallText content="About" />
          </RouteLink>
          <RouteLink href="/newsletter">
            <SmallText content="Newsletter" />
          </RouteLink>
          <RouteLink href="/gears">
            <SmallText content="Video &#38; Photo Setup" />
          </RouteLink>
        </div>
      </div>
    </Container>
  );
}

export default Footer;
