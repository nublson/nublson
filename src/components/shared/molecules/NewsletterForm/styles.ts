import { Form } from "@unform/web";
import styled from "styled-components";

interface FormProps {
  feedback?: "success" | "error";
}

export const Content = styled.div<FormProps>`
  width: 60%;
  margin: 2rem auto 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    width: 90%;

    align-items: center;
  }

  &:last-child {
    text-align: center;
    color: ${(props) =>
      props.feedback === "success"
        ? props.theme.colors.success
        : props.feedback === "error" && props.theme.colors.error};
  }

  .footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > :last-child {
      font-weight: 600;
      text-align: right;
      color: ${(props) => props.theme.colors.off_white};
    }
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

    @media ${(props) => props.theme.mediaQueries.medium_s} {
      width: 100%;
      height: 5rem;
      padding: 0.5rem;
      border: 1px solid ${(props) => props.theme.colors.line};
      border-radius: 0px;
      background-color: ${(props) => props.theme.colors.input_background};
    }
  }

  @media ${(props) => props.theme.mediaQueries.medium_s} {
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

export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > :last-child {
    font-weight: 600;
    text-align: right;
    color: ${(props) => props.theme.colors.off_white};
  }

  @media ${(props) => props.theme.mediaQueries.medium_s} {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    & > :last-child {
      text-align: center;
    }
  }
`;
