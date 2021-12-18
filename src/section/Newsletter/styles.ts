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
    width: 90%;

    align-items: center;
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
  flex-direction: row;
  align-items: center;
  justify-content: center;

  & > :first-child {
    flex: 1;
    border-radius: 0px;

    @media ${(props) => props.theme.mediaQueries.small} {
      width: 100%;
      height: 5rem;
      padding: 0.5rem;
      border: 1px solid ${(props) => props.theme.colors.line};
      border-radius: 0px;
      background-color: ${(props) => props.theme.colors.input_background};
    }
  }

  @media ${(props) => props.theme.mediaQueries.small} {
    height: 11rem;
    padding: 0;

    border: none;
    background-color: ${(props) => props.theme.colors.background};

    flex-direction: column;
    gap: 1rem;

    button {
      height: 5rem;
      width: 100%;
    }
  }
`;
