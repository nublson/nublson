import { FormHandles, SubmitHandler } from "@unform/core";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import * as Yup from "yup";
import { useIssue, useSubscribers } from "../../../../hooks/useNewsletter";
import { api } from "../../../../services/api";
import { IButtonsProps, ITextsProps } from "../../../../utils/types";
import { Content, Footer, StyledForm } from "./styles";

const RouteLink = dynamic(() => import("../../atoms/RouteLink"));
const XSmallText = dynamic<ITextsProps>(() =>
  import("../../atoms/Texts").then((module) => module.XSmallText)
);
const MainButton = dynamic<IButtonsProps>(() =>
  import("../Buttons").then((module) => module.MainButton)
);
const Input = dynamic(() => import("../Input"));

interface FormData {
  email: string;
}

interface FormProps {
  type: "success" | "error";
  message: string;
}

function NewsletterForm() {
  const formRef = useRef<FormHandles>(null);
  const [formFeedback, setFormFeedback] = useState<FormProps>({} as FormProps);
  const [loading, setLoading] = useState(false);
  const subscribersData = useSubscribers();
  const issuesCount = useIssue();

  const handleSubmit: SubmitHandler<FormData> = async (data, { reset }) => {
    setLoading(true);

    try {
      //TODO Remove all previous errors
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required"),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      //* Validation passed
      await api
        .post("/newsletter/subscribe", {
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
          setFormFeedback({
            type: "error",
            message: err.response.data.message,
          });

          reset();
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      //! Validation failed
      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          setFormFeedback({
            type: "error",
            message: error.message,
          });
        });
      }

      setLoading(false);
      reset();
    }
  };

  useEffect(() => {
    setFormFeedback({} as FormProps);
  }, []);

  return (
    <Content feedback={formFeedback.type}>
      <StyledForm
        ref={formRef}
        onSubmit={handleSubmit}
        target="_top"
        action="/api/newsletter/subscribe"
      >
        <Input
          name="email"
          placeholder="Enter your email"
          onFocus={() => {
            setFormFeedback({} as FormProps);
          }}
        />
        <MainButton title="Subscribe" />
      </StyledForm>
      <Footer>
        {loading ? (
          <Loader type="Puff" color="#fff" height={10} width={10} />
        ) : (
          formFeedback && <XSmallText content={formFeedback.message} />
        )}

        <RouteLink href="/newsletter">
          <XSmallText
            content={`${subscribersData ? subscribersData : 0} ${
              subscribersData === 1 ? "subscriber" : "subscribers"
            } - ${issuesCount ? issuesCount.length : 0} ${
              issuesCount?.length === 1 ? "road" : "roads"
            }`}
          />
        </RouteLink>
      </Footer>
    </Content>
  );
}

export default NewsletterForm;
