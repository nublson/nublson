import { PostList } from "@/components/post-list";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface PostsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
  groupByYear?: boolean;
  collapseAfter?: number;
  className?: string;
}

export default function PostsSection({
  title,
  href,
  id,
  posts,
  groupByYear = false,
  collapseAfter,
  className,
}: PostsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id} className={className}>
      <PostList
        posts={posts}
        groupByYear={groupByYear}
        collapseAfter={collapseAfter}
      />
    </SectionWrapper>
  );
}
