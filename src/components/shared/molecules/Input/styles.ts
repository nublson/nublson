import styled from "styled-components";

export const StyledInput = styled.input`
  width: 100%;
  height: 4rem;
  border: none;
  background-color: transparent;
  font-size: 1.8rem;
  color: ${(props) => props.theme.colors.label};
`;
