import { FormHandles, SubmitHandler } from "@unform/core";
import { useRef } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Section } from "../../components/Layout/elements";
import RouteLink from "../../components/shared/atoms/RouteLink";
import Texts from "../../components/shared/atoms/Texts";
import Buttons from "../../components/shared/molecules/Buttons";
import Cards from "../../components/shared/molecules/Cards";
import Input from "../../components/shared/molecules/Input";
import { formatSlug } from "../../utils/formatter";
import { BlogItem } from "../../utils/types";
import { ArticleList, Container, StyledForm } from "./styles";

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

        <ArticleList center={posts.length <= 1}>
          {!posts.length ? (
            <Texts.Medium content="No articles published" />
          ) : (
            posts.map((article) => (
              <RouteLink
                key={article.id}
                href={`/blog/${formatSlug(article.title)}`}
              >
                <Cards.Blog
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  read_time={article.read_time}
                />
              </RouteLink>
            ))
          )}
        </ArticleList>
      </Container>
    </Section>
  );
}

export default Articles;
