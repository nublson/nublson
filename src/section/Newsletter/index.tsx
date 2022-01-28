import { FormHandles, SubmitHandler } from "@unform/core";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import useSWR from "swr";
import * as Yup from "yup";
import { api } from "../../services/api";
import { IButtonsProps, ISectionProps, ITextsProps } from "../../utils/types";
import { Container, Content, Footer, StyledForm } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const RouteLink = dynamic(
  () => import("../../components/shared/atoms/RouteLink")
);
const XSmallText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.XSmallText
  )
);
const MainButton = dynamic<IButtonsProps>(() =>
  import("../../components/shared/molecules/Buttons").then(
    (module) => module.MainButton
  )
);
const Input = dynamic(() => import("../../components/shared/molecules/Input"));

interface FormData {
  email: string;
}

interface FormProps {
  type: "success" | "error";
  message: string;
}

const fetchSubscribers = async (url: string) => {
  const res = await api.get(url);

  return res.data.subscribers;
};

const fetchIssues = async (url: string) => {
  const res = await api.get(url);

  return res.data.issues;
};

function Newsletter() {
  const formRef = useRef<FormHandles>(null);
  const [formFeedback, setFormFeedback] = useState<FormProps>({} as FormProps);
  const [loading, setLoading] = useState(false);
  const { data: subscribersData } = useSWR(
    "/newsletter/subscribers",
    fetchSubscribers,
    {
      refreshInterval: 3000,
    }
  );

  const { data: issuesData } = useSWR("/newsletter/issues", fetchIssues, {
    refreshInterval: 60000,
  });

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
    <Section
      id="newsletter"
      title="Subscribe to my newsletter"
      description="No spam, just insightful content on tech, photography, filmmaking, code, and much more."
    >
      <Container>
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
                } - ${issuesData ? issuesData : 0} ${
                  issuesData === 1 ? "road" : "roads"
                }`}
              />
            </RouteLink>
          </Footer>
        </Content>
      </Container>
    </Section>
  );
}

export default Newsletter;
