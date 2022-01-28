import { ITextsProps } from "../../../../utils/types";
import {
  StyledTextLarge,
  StyledTextMedium,
  StyledTextSmall,
  StyledTextXSmall,
} from "./styles";

export function LargeText({ content }: ITextsProps) {
  return <StyledTextLarge>{content}</StyledTextLarge>;
}

export function MediumText({ content }: ITextsProps) {
  return <StyledTextMedium>{content}</StyledTextMedium>;
}

export function SmallText({ content }: ITextsProps) {
  return <StyledTextSmall>{content}</StyledTextSmall>;
}

export function XSmallText({ content }: ITextsProps) {
  return <StyledTextXSmall>{content}</StyledTextXSmall>;
}
