import { FormHandles, SubmitHandler } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import useSWR from "swr";
import * as Yup from "yup";
import { Section } from "../../components/Layout/elements";
import RouteLink from "../../components/shared/atoms/RouteLink";
import Texts from "../../components/shared/atoms/Texts";
import Buttons from "../../components/shared/molecules/Buttons";
import Input from "../../components/shared/molecules/Input";
import { api } from "../../services/api";
import { Container, Content, Footer, StyledForm } from "./styles";

interface FormData {
  email: string;
}

interface FormProps {
  type: "success" | "error";
  message: string;
}

const fetchSubscribers = async (url: string) => {
  const res = await api.get(url);

  const subscribersCount = await res.data.subscribers.length;

  return subscribersCount;
};

const fetchIssues = async (url: string) => {
  const res = await api.get(url);

  const issuesCount = await res.data.issues.length;

  return issuesCount;
};

function Newsletter() {
  const formRef = useRef<FormHandles>(null);
  const [formFeedback, setFormFeedback] = useState<FormProps>({} as FormProps);
  const [loading, setLoading] = useState(false);
  const { data: subscribersData } = useSWR("/subscribers", fetchSubscribers, {
    refreshInterval: 1000,
  });

  const { data: issuesData } = useSWR("/issues", fetchIssues, {
    refreshInterval: 1000,
  });

  const handleSubmit: SubmitHandler<FormData> = async (data, { reset }) => {
    setLoading(true);

    try {
      // Remove all previous errors
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required"),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      // Validation passed
      await api
        .post("/subscribe", {
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
          <Footer>
            {loading ? (
              <Loader type="Puff" color="#fff" height={10} width={10} />
            ) : (
              formFeedback && <Texts.XSmall content={formFeedback.message} />
            )}

            <RouteLink href="/newsletter">
              <Texts.XSmall
                content={`${subscribersData ? subscribersData : 0} ${
                  subscribersData === 1 ? "subscriber" : "subscribers"
                } - ${issuesData ? issuesData : 0} ${
                  issuesData === 1 ? "issue" : "issues"
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
