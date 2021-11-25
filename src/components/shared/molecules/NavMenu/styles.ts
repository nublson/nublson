import { Link } from "react-scroll";
import styled from "styled-components";

export const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  ul {
    list-style: none;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
  }

  .active {
    font-weight: 600;
  }

  a {
    color: ${(props) => props.theme.colors.off_white};
    text-decoration: underline transparent;

    &:hover {
      text-decoration: underline;
      transition: all 0.2s;
    }
  }
`;

export const ScrollLink = styled(Link)`
  cursor: pointer;
`;
