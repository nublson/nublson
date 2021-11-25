import { Link } from "react-scroll";
import styled from "styled-components";

interface HomeProps {
  article?: boolean;
}

export const Container = styled.div<HomeProps>`
  width: 100%;
  flex: 1;

  padding-top: 10rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5rem;

  ${(props) =>
    !props.article &&
    `
    padding-bottom: 1rem;
  `}
`;

export const ScrollLink = styled(Link)`
  cursor: pointer;
`;
