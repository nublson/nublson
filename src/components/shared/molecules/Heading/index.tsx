import { Texts } from "../../atoms";
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
      <h1>{title}</h1>
      <Texts.Large content={subtitle} />
    </Container>
  );
}

export default Heading;
