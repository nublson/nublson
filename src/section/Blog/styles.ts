import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 11rem;

  & > :last-child {
    font-weight: 600;
    color: ${(props) => props.theme.colors.off_white};
  }
`;

export const BlogList = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 1.5rem;
`;
