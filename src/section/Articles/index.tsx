import { FormHandles, SubmitHandler } from "@unform/core";
import { useRef } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Section } from "../../components/Layout/elements";
import { Buttons, Cards, Input } from "../../components/shared/molecules";
import { RouteLink } from "../../components/shared/atoms";
import { BlogItem } from "../../utils/types";
import { ArticleList, Container, StyledForm } from "./styles";
import slugify from "slugify";

interface FormData {
  search: string;
}

interface ArticlesProps {
  posts: BlogItem[];
}

function Articles({ posts }: ArticlesProps) {
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
          {posts.map((article) => (
            <RouteLink
              key={article.id}
              href={`/blog/${slugify(article.title.toLowerCase())}`}
            >
              <Cards.Blog
                thumbnail={article.thumbnail}
                title={article.title}
                description={article.description}
                publish_date={article.publish_date}
                read_time={article.read_time}
              />
            </RouteLink>
          ))}
        </ArticleList>
      </Container>
    </Section>
  );
}

export default Articles;
