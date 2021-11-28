import { Section } from "../../components/Layout/elements";
import { RouteLink } from "../../components/shared/atoms";
import { Buttons, Cards } from "../../components/shared/molecules";
import { BlogItem } from "../../utils/types";
import { formatSlug } from "../../utils/formatter";
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
