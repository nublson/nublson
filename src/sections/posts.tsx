import { PostList } from "@/components/post-list";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface PostsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
  groupByYear?: boolean;
}

export default function PostsSection({
  title,
  href,
  id,
  posts,
  groupByYear = false,
}: PostsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <PostList posts={posts} groupByYear={groupByYear} />
    </SectionWrapper>
  );
}
