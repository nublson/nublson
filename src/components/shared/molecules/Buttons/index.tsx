import { HTMLAttributes, ReactNode } from "react";
import { MediumText, SmallText } from "../../atoms/Texts";
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

export function MainButton({ title, ...rest }: ButtonsProps) {
  return (
    <Container {...rest}>
      <MediumText content={title} />
    </Container>
  );
}

export function TextButton({ title }: ButtonsProps) {
  return <SmallText content={title} />;
}

export function IconButton({ icon, ...rest }: ButtonIconProps) {
  return <StyledIcon {...rest}>{icon}</StyledIcon>;
}

export function GumroadButton({ productUrl }: GumroadButtonProps) {
  return (
    <a
      className="gumroad-button"
      href={`${productUrl}?wanted=${process.env.GUMROAD_OVERLAY_CHECKOUT}`}
    >
      Purchase here
    </a>
  );
}
