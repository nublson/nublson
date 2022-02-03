import dynamic from "next/dynamic";
import { IPodcastProps, ITextsProps } from "../../../../utils/types";
import { Container, PodcastContainer } from "./styles";

const SmallTitle = dynamic<ITextsProps>(() =>
  import("../../atoms/Titles").then((module) => module.SmallTitle)
);
const MediumText = dynamic<ITextsProps>(() =>
  import("../../atoms/Texts").then((module) => module.MediumText)
);

function PodcastIFrame({ slug }: IPodcastProps) {
  return (
    <Container>
      <SmallTitle content="Audio only podcast" />
      <MediumText content="available on  Spotify and Apple Podcast" />
      <PodcastContainer
        src={`https://anchor.fm/mindjourney/embed/episodes/${slug}`}
        frameBorder="0"
        scrolling="no"
      />
    </Container>
  );
}

export default PodcastIFrame;
