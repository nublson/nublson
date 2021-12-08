import { Link } from "react-scroll";
import styled from "styled-components";

export const WebContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${(props) => props.theme.mediaQueries.small} {
    display: none;
  }
`;

export const MobileContainer = styled.div`
  display: none;

  @media ${(props) => props.theme.mediaQueries.small} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ScrollLink = styled(Link)`
  cursor: pointer;
`;

export const StyledItems = styled.ul`
  list-style: none;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;

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
