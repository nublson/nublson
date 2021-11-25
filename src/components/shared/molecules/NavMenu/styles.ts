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
`;

export const ScrollLink = styled(Link)`
  cursor: pointer;
`;
