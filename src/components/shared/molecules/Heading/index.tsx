import Image from "next/image";
import { LargeText, MediumText } from "../../atoms/Texts";
import { LargeTitle } from "../../atoms/Titles";
import { Container, Content, Thumbnail } from "./styles";

interface HeadingProps {
  top: string;
  title: string;
  subtitle?: string;
  image: string | StaticImageData;
  article?: boolean;
}

function Heading({ top, title, subtitle, image, article }: HeadingProps) {
  return (
    <Container>
      <Content>
        <MediumText content={top} />
        <LargeTitle content={title} />
        {subtitle && <LargeText content={subtitle} />}
      </Content>
      <Thumbnail article={article}>
        <Image
          src={image}
          alt="Thumbnail"
          objectFit="cover"
          layout="fill"
          priority={true}
        />
      </Thumbnail>
    </Container>
  );
}

export default Heading;
