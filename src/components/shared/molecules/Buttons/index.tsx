import { HTMLAttributes, ReactNode } from "react";
import Texts from "../../atoms/Texts";
import { Container, StyledIcon } from "./styles";

interface ButtonsProps {
  title: string;
}

interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
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

function Icon({ icon, ...rest }: ButtonIconProps) {
  return <StyledIcon {...rest}>{icon}</StyledIcon>;
}

const Buttons = {
  Main,
  Text,
  Icon,
};

export default Buttons;
