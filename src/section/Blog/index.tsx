import { Section } from "../../components/Layout/elements";
import RouteLink from "../../components/shared/atoms/RouteLink";
import Texts from "../../components/shared/atoms/Texts";
import Buttons from "../../components/shared/molecules/Buttons";
import { Blog as BlogCard } from "../../components/shared/molecules/Cards";
import { BlogItem } from "../../utils/types";
import { BlogList, Container } from "./styles";

interface BlogProps {
  posts: BlogItem[];
}

function Blog({ posts }: BlogProps) {
  return (
    <Section id="blog" title="Sometimes I also write down words.">
      <Container>
        <BlogList center={posts.length <= 1}>
          {!posts.length ? (
            <Texts.Medium content="No articles published" />
          ) : (
            posts.map((article) => (
              <RouteLink key={article.id} href={`/blog/${article.slug}`}>
                <BlogCard
                  thumbnail={article.thumbnail}
                  title={article.title}
                  description={article.description}
                  publish_date={article.publish_date}
                  read_time={article.read_time}
                  slug={article.slug}
                />
              </RouteLink>
            ))
          )}
        </BlogList>

        <RouteLink href="/blog">
          <Buttons.Text title="See all blog posts" />
        </RouteLink>
      </Container>
    </Section>
  );
}

export default Blog;
