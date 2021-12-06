import { Link } from "react-scroll";
import styled from "styled-components";

interface HomeProps {
  article?: boolean;
}

export const Container = styled.div<HomeProps>`
  width: 100%;
  flex: 1;

  padding-top: 8rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5rem;

  ${(props) =>
    !props.article &&
    `
    padding-bottom: 2rem;
  `}

  @media ${(props) => props.theme.mediaQueries.medium} {
    padding-top: 5rem;

    gap: 3rem;
  }
`;

export const ScrollLink = styled(Link)`
  cursor: pointer;
`;
