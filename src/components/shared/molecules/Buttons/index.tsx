import {
  IButtonIconProps,
  IButtonsProps,
  IGumroadButtonProps,
} from "../../../../utils/types";
import { MediumText, SmallText } from "../../atoms/Texts";
import { Container, PurchaseContainer, StyledIcon } from "./styles";

export function MainButton({ title, ...rest }: IButtonsProps) {
  return (
    <Container {...rest}>
      <MediumText content={title} />
    </Container>
  );
}

export function TextButton({ title }: IButtonsProps) {
  return <SmallText content={title} />;
}

export function IconButton({ icon, ...rest }: IButtonIconProps) {
  return <StyledIcon {...rest}>{icon}</StyledIcon>;
}

export function GumroadButton({ productUrl }: IGumroadButtonProps) {
  return (
    <PurchaseContainer
      href={`${productUrl}?wanted=${process.env.GUMROAD_OVERLAY_CHECKOUT}`}
      target="_blank"
      rel="noreferrer"
    >
      Purchase here
    </PurchaseContainer>
  );
}
