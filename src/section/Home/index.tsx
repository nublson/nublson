import { RiArrowDownSLine } from "react-icons/ri";
import { Heading } from "../../components/shared/molecules";
import { Container } from "./styles";

interface HomeProps {
  top: string;
  title: string;
  subtitle: string;
  image: StaticImageData;
  article?: boolean;
}

function Home({ top, title, subtitle, image, article }: HomeProps) {
  return (
    <Container article={article}>
      <Heading
        top={top}
        title={title}
        subtitle={subtitle}
        image={image}
        article={article}
      />
      {!article && <RiArrowDownSLine size={30} color="#FCFCFC" />}
    </Container>
  );
}

export default Home;
