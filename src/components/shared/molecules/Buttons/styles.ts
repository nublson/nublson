import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem 3.5rem;
  background-color: ${(props) => props.theme.colors.off_white};

  color: ${(props) => props.theme.colors.off_black};
  font-weight: 600;
`;
