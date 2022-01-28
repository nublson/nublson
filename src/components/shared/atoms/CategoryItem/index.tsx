import { ICategoryItemProps } from "../../../../utils/types";
import { StyledCategory } from "./styles";

function CategoryItem({ name, ...rest }: ICategoryItemProps) {
  return <StyledCategory {...rest}>{name}</StyledCategory>;
}

export default CategoryItem;
