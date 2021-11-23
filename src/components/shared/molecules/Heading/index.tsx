import Image from "next/image";
import { Texts, Titles } from "../../atoms";
import { Container, Content, Thumbnail } from "./styles";

interface HeadingProps {
  top: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
}

function Heading({ top, title, subtitle, image }: HeadingProps) {
  return (
    <Container>
      <Content>
        <Texts.Medium content={top} />
        <Titles.Large content={title} />
        <Texts.Large content={subtitle} />
      </Content>
      <Thumbnail>
        <Image src={image} alt="Thumbnail" />
      </Thumbnail>
    </Container>
  );
}

export default Heading;
