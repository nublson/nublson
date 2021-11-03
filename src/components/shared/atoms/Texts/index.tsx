import {
  StyledTextLarge,
  StyledTextMedium,
  StyledTextSmall,
  StyledTextXSmall,
} from "./styles";

interface TextsProps {
  content: string;
}

function Large({ content }: TextsProps) {
  return <StyledTextLarge>{content}</StyledTextLarge>;
}

function Medium({ content }: TextsProps) {
  return <StyledTextMedium>{content}</StyledTextMedium>;
}

function Small({ content }: TextsProps) {
  return <StyledTextSmall>{content}</StyledTextSmall>;
}

function XSmall({ content }: TextsProps) {
  return <StyledTextXSmall>{content}</StyledTextXSmall>;
}

const texts = {
  Large,
  Medium,
  Small,
  XSmall,
};

export default texts;
