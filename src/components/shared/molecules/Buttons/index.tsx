import { Texts } from "../../atoms";
import { Container } from "./styles";

interface ButtonsProps {
  title: string;
}

function Main({ title }: ButtonsProps) {
  return (
    <Container>
      <Texts.Medium content={title} />
    </Container>
  );
}

function Text({ title }: ButtonsProps) {
  return <Texts.Small content={title} />;
}

const Buttons = {
  Main,
  Text,
};

export default Buttons;
