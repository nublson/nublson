import { RiArrowDownSLine } from "react-icons/ri";
import { Heading } from "../../components/shared/molecules";
import { Container, ScrollLink } from "./styles";
import { HTMLAttributes } from "react";

interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  top: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
  article?: boolean;
}

function Home({ top, title, subtitle, image, article, ...rest }: HomeProps) {
  return (
    <Container article={article} {...rest}>
      <Heading
        top={top}
        title={title}
        subtitle={subtitle}
        image={image}
        article={article}
      />
      {!article && (
        <ScrollLink to="work" spy={true} smooth={true} duration={1000}>
          <RiArrowDownSLine size={30} color="#FCFCFC" />
        </ScrollLink>
      )}
    </Container>
  );
}

export default Home;
