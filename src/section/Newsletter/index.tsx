import { FormHandles, SubmitHandler } from "@unform/core";
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

function Newsletter() {
  const formRef = useRef<FormHandles>(null);
  const [formError, setFormError] = useState("");

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
      console.log(data);
      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          setFormError(error.message);
        });
      }

      reset();
    }
  };

  useEffect(() => {
    setFormError("");
  }, []);

  return (
    <Section
      id="newsletter"
      title="Subscribe to my newsletter"
      description="No spam, just insightful content on tech, photography, filmmaking, code, and much more."
    >
      <Container>
        <Content>
          <StyledForm ref={formRef} onSubmit={handleSubmit}>
            <Input
              name="email"
              placeholder="Enter your email"
              onFocus={() => {
                setFormError("");
              }}
            />
            <Buttons.Main title="Subscribe" />
          </StyledForm>
          {formError && <Texts.XSmall content={formError} />}
        </Content>
      </Container>
    </Section>
  );
}

export default Newsletter;
