import Image from "next/image";
import { Texts, Titles } from "../../atoms";
import { Container, Content, Thumbnail } from "./styles";

interface HeadingProps {
  top: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
  article?: boolean;
}

function Heading({ top, title, subtitle, image, article }: HeadingProps) {
  return (
    <Container>
      <Content>
        <Texts.Medium content={top} />
        <Titles.Large content={title} />
        <Texts.Large content={subtitle} />
      </Content>
      <Thumbnail article={article}>
        <Image
          src={image}
          alt="Thumbnail"
          objectFit="cover"
          layout="fill"
          priority
        />
      </Thumbnail>
    </Container>
  );
}

export default Heading;
