import {
  StyledTextLarge,
  StyledTextMedium,
  StyledTextSmall,
  StyledTextXSmall,
} from "./styles";

interface TextsProps {
  content: string;
}

export function LargeText({ content }: TextsProps) {
  return <StyledTextLarge>{content}</StyledTextLarge>;
}

export function MediumText({ content }: TextsProps) {
  return <StyledTextMedium>{content}</StyledTextMedium>;
}

export function SmallText({ content }: TextsProps) {
  return <StyledTextSmall>{content}</StyledTextSmall>;
}

export function XSmallText({ content }: TextsProps) {
  return <StyledTextXSmall>{content}</StyledTextXSmall>;
}
