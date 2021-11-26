import styled from "styled-components";
import { Form } from "@unform/web";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15rem;
`;

export const StyledForm = styled(Form)`
  width: 100%;
  max-width: 60%;
  margin: 0 auto;
  height: 5rem;
  padding: 0.5rem;

  border: 1px solid ${(props) => props.theme.colors.line};
  background-color: ${(props) => props.theme.colors.input_background};

  display: flex;
  align-items: center;
  justify-content: center;

  & > :first-child {
    flex: 1;
  }
`;

export const ArticleList = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 1.5rem;
  grid-row-gap: 5rem;
`;
