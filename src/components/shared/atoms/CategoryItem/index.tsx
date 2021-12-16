import { HTMLAttributes } from "react";
import { StyledCategory } from "./styles";

interface CategoryItemProps extends HTMLAttributes<HTMLParagraphElement> {
  name: string;
}

function CategoryItem({ name, ...rest }: CategoryItemProps) {
  return <StyledCategory {...rest}>{name}</StyledCategory>;
}

export default CategoryItem;
