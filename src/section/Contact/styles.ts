import { Props } from "react";
import styled from "styled-components";

export const Container = styled.div`
  margin-bottom: 5rem;
`;

export const StyledLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.colors.off_black};
`;
