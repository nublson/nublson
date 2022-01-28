import { ITextsProps } from "../../../../utils/types";
import {
  StyledTitleLarge,
  StyledTitleMedium,
  StyledTitleSmall,
} from "./styles";

export function LargeTitle({ content }: ITextsProps) {
  return <StyledTitleLarge>{content}</StyledTitleLarge>;
}

export function MediumTitle({ content }: ITextsProps) {
  return <StyledTitleMedium>{content}</StyledTitleMedium>;
}

export function SmallTitle({ content }: ITextsProps) {
  return <StyledTitleSmall>{content}</StyledTitleSmall>;
}
