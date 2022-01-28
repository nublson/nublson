import { useRouter } from "next/router";
import { Link } from "react-scroll";
import { IItemsProps } from "../../../../utils/types";
import RouteLink from "../../atoms/RouteLink";
import { MediumText } from "../../atoms/Texts";
import { StyledItem } from "./styles";

export const NavItems = ({ items, scrollAction }: IItemsProps) => {
  const { pathname } = useRouter();

  return (
    <ul>
      {items.map((item, index) => {
        return (
          <StyledItem
            key={index}
            className={pathname === `/${item.path}` ? "active" : ""}
          >
            {item.name === "Contact" ? (
              <Link
                href="#contact"
                to={item.path}
                spy={true}
                smooth={true}
                duration={1000}
                onClick={scrollAction}
              >
                <MediumText content={item.name} />
              </Link>
            ) : (
              <RouteLink href={`/${item.path}`}>
                <MediumText content={item.name} />
              </RouteLink>
            )}
          </StyledItem>
        );
      })}
    </ul>
  );
};
