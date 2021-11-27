import blog1 from "../../assets/img/blog1.jpg";
import { Section } from "../../components/Layout/elements";
import { RouteLink } from "../../components/shared/atoms";
import { Buttons, Cards } from "../../components/shared/molecules";
import { BlogItem } from "../../utils/types";
import { BlogList, Container } from "./styles";

interface BlogProps {
  posts: BlogItem[];
}

function Blog({ posts }: BlogProps) {
  return (
    <Section
      id="blog"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    >
      <Container>
        <BlogList>
          {posts.map((article) => (
            <Cards.Blog
              key={article.id}
              thumbnail={article.thumbnail}
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
