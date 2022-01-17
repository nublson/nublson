import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  .feedback {
    color: ${(props) => props.theme.colors.off_white};
    text-align: center;
  }
`;
