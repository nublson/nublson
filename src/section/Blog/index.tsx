import dynamic from "next/dynamic";
import {
  IBlogCard,
  IBlogItem,
  IButtonsProps,
  ISectionProps,
  ITextsProps,
} from "../../utils/types";
import { BlogList, Container } from "./styles";

const Section = dynamic<ISectionProps>(() =>
  import("../../components/Layout/elements").then((module) => module.Section)
);
const RouteLink = dynamic(
  () => import("../../components/shared/atoms/RouteLink")
);
const MediumText = dynamic<ITextsProps>(() =>
  import("../../components/shared/atoms/Texts").then(
    (module) => module.MediumText
  )
);
const TextButton = dynamic<IButtonsProps>(() =>
  import("../../components/shared/molecules/Buttons").then(
    (module) => module.TextButton
  )
);
const BlogCard = dynamic<IBlogCard>(() =>
  import("../../components/shared/molecules/Cards").then(
    (module) => module.Blog
  )
);

interface BlogProps {
  posts: IBlogItem[];
}

function Blog({ posts }: BlogProps) {
  return (
    <Section id="blog" title="Sometimes I also write down words.">
      <Container>
        <BlogList center={posts.length <= 1}>
          {!posts.length ? (
            <MediumText content="No articles published" />
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
          <TextButton title="See all blog posts" />
        </RouteLink>
      </Container>
    </Section>
  );
}

export default Blog;
