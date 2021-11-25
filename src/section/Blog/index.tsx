import blog1 from "../../assets/img/blog1.jpg";
import blog2 from "../../assets/img/blog2.jpg";
import { Section } from "../../components/Layout/elements";
import { Buttons, Cards } from "../../components/shared/molecules";
import { BlogList, Container } from "./styles";

import { RouteLink } from "../../components/shared/atoms";

function Blog() {
  return (
    <Section
      id="blog"
      title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
    >
      <Container>
        <BlogList>
          <Cards.Blog
            thumbnail={blog1}
            title="Dolor potenti diam varius nisi, enim, vitae."
            description="Ipsum arcu ultrices nunc blandit urna, enim. Varius turpis sagittis ipsum aliquam at rhoncus praesent est."
            publish_date="September 18, 2021"
            read_time={3}
          />
          <Cards.Blog
            thumbnail={blog2}
            title="Nunc donec faucibus mattis non pellentesque nam amet, est."
            description="Turpis massa in vitae fermentum ut. A, in vitae pharetra in tristique ultrices consectetur sit."
            publish_date="September 10, 2021"
            read_time={5}
          />
        </BlogList>

        <RouteLink href="/blog">
          <Buttons.Text title="See all blog posts" />
        </RouteLink>
      </Container>
    </Section>
  );
}

export default Blog;
