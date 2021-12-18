import { HTMLAttributes, ReactNode } from "react";
import Texts from "../../atoms/Texts";
import { Container, StyledIcon } from "./styles";

interface ButtonsProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
}

interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

function Main({ title, ...rest }: ButtonsProps) {
  return (
    <Container {...rest}>
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
