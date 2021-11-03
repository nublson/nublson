import {
  StyledTitleLarge,
  StyledTitleMedium,
  StyledTitleSmall,
} from "./styles";

interface TextsProps {
  content: string;
}

function Large({ content }: TextsProps) {
  return <StyledTitleLarge>{content}</StyledTitleLarge>;
}

function Medium({ content }: TextsProps) {
  return <StyledTitleMedium>{content}</StyledTitleMedium>;
}

function Small({ content }: TextsProps) {
  return <StyledTitleSmall>{content}</StyledTitleSmall>;
}

const titles = {
  Large,
  Medium,
  Small,
};

export default titles;
