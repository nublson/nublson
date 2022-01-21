import { HTMLAttributes, ReactNode } from "react";
import Texts from "../../atoms/Texts";
import { Container, StyledIcon } from "./styles";

interface ButtonsProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
}

interface ButtonIconProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

interface GumroadButtonProps {
  productUrl: string;
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

function Gumroad({ productUrl }: GumroadButtonProps) {
  return (
    <a className="gumroad-button" href={`${productUrl}?wanted=true`}>
      Purchase here
    </a>
  );
}

const Buttons = {
  Main,
  Text,
  Icon,
  Gumroad,
};

export default Buttons;
