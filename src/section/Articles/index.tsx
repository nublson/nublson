import { FormHandles, SubmitHandler } from "@unform/core";
import { useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import thumbnail from "../../assets/img/blog3.jpg";
import { Section } from "../../components/Layout/elements";
import { Buttons, Cards, Input } from "../../components/shared/molecules";
import { articles as data } from "../../utils/articles.json";
import { ArticleList, Container, StyledForm } from "./styles";

interface FormData {
  search: string;
}

function Articles() {
  const [articles] = useState(data);

  const formRef = useRef<FormHandles>(null);

  const handleSubmit: SubmitHandler<FormData> = (data, { reset }) => {
    console.log(data);

    reset();
  };

  return (
    <Section id="articles">
      <Container>
        <StyledForm ref={formRef} onSubmit={handleSubmit}>
          <Input name="search" placeholder="Search" />
          <Buttons.Icon
            onClick={formRef.current?.submitForm}
            icon={<RiSearchLine size="24" color="#020202" />}
          />
        </StyledForm>

        <ArticleList>
          {articles.map((article) => (
            <Cards.Blog
              key={article.id}
              thumbnail={thumbnail}
              title={article.title}
              description={article.description}
              publish_date={article.publish_date}
              read_time={article.read_time}
            />
          ))}
        </ArticleList>
      </Container>
    </Section>
  );
}

export default Articles;
