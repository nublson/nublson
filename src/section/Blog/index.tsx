import { Section } from "../../components/Layout/elements";
import { RouteLink } from "../../components/shared/atoms";
import { Buttons, Cards } from "../../components/shared/molecules";
import { BlogItem } from "../../utils/types";
import { BlogList, Container } from "./styles";
import slugify from "slugify";

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
        </BlogList>

        <RouteLink href="/blog">
          <Buttons.Text title="See all blog posts" />
        </RouteLink>
      </Container>
    </Section>
  );
}

export default Blog;
