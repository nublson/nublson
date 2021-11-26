import { useState } from "react";
import blog1 from "../../assets/img/blog1.jpg";
import { Section } from "../../components/Layout/elements";
import { RouteLink } from "../../components/shared/atoms";
import { Buttons, Cards } from "../../components/shared/molecules";
import { articles as data } from "../../utils/articles.json";
import { BlogList, Container } from "./styles";

function Blog() {
  const [articles] = useState(data);

  return (
    <Section
      id="blog"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    >
      <Container>
        <BlogList>
          {articles.map((article) => (
            <Cards.Blog
              key={article.id}
              thumbnail={blog1}
              title={article.title}
              description={article.description}
              publish_date={article.publish_date}
              read_time={article.read_time}
            />
          ))}
        </BlogList>

        <RouteLink href="/blog">
          <Buttons.Text title="See all blog posts" />
        </RouteLink>
      </Container>
    </Section>
  );
}

export default Blog;
