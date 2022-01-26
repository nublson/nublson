import {
  StyledTitleLarge,
  StyledTitleMedium,
  StyledTitleSmall,
} from "./styles";

interface TextsProps {
  content: string;
}

export function LargeTitle({ content }: TextsProps) {
  return <StyledTitleLarge>{content}</StyledTitleLarge>;
}

export function MediumTitle({ content }: TextsProps) {
  return <StyledTitleMedium>{content}</StyledTitleMedium>;
}

export function SmallTitle({ content }: TextsProps) {
  return <StyledTitleSmall>{content}</StyledTitleSmall>;
}
