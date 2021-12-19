import { FormHandles, SubmitHandler } from "@unform/core";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Section } from "../../components/Layout/elements";
import Texts from "../../components/shared/atoms/Texts";
import Buttons from "../../components/shared/molecules/Buttons";
import Input from "../../components/shared/molecules/Input";
import { Container, Content, StyledForm } from "./styles";

interface FormData {
  email: string;
}

interface FormProps {
  type: "success" | "error";
  message: string;
}

function Newsletter() {
  const formRef = useRef<FormHandles>(null);
  const [formFeedback, setFormFeedback] = useState<FormProps>({} as FormProps);

  const handleSubmit: SubmitHandler<FormData> = async (data, { reset }) => {
    try {
      // Remove all previous errors
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Please, enter a valid email")
          .required("You need to enter your email"),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      // Validation passed
      await axios
        .put("/api/mail", {
          email: data.email,
        })
        .then((response) => {
          setFormFeedback({
            type: "success",
            message: response.data.message,
          });
          reset();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          setFormFeedback({
            type: "error",
            message: error.message,
          });
        });
      }

      reset();
    }
  };

  useEffect(() => {
    setFormFeedback({} as FormProps);
  }, []);

  return (
    <Section
      id="newsletter"
      title="Subscribe to my newsletter"
      description="No spam, just insightful content on tech, photography, filmmaking, code, and much more."
    >
      <Container>
        <Content feedback={formFeedback.type}>
          <StyledForm ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="email"
              placeholder="Enter your email"
              onFocus={() => {
                setFormFeedback({} as FormProps);
              }}
            />
            <Buttons.Main title="Subscribe" />
          </StyledForm>
          {formFeedback && <Texts.XSmall content={formFeedback.message} />}
        </Content>
      </Container>
    </Section>
  );
}

export default Newsletter;
