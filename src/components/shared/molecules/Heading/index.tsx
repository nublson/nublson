import { Texts, Titles } from "../../atoms";
import { Container } from "./styles";

interface HeadingProps {
  top: string;
  title: string;
  subtitle: string;
}

function Heading({ top, title, subtitle }: HeadingProps) {
  return (
    <Container>
      <Texts.Medium content={top} />
      <Titles.Large content={title} />
      <Texts.Large content={subtitle} />
    </Container>
  );
}

export default Heading;
