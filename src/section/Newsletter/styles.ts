import { Form } from "@unform/web";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
`;

export const Content = styled.div`
  width: 60%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.5rem;

  @media ${(props) => props.theme.mediaQueries.small} {
    width: 85%;
  }

  &:last-child {
    color: #f2545b;
  }
`;

export const StyledForm = styled(Form)`
  width: 100%;
  height: 100%;
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
