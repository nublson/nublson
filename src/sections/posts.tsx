import { PostItem } from "@/components/post-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface PostsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
}

export default function PostsSection({
  title,
  href,
  id,
  posts,
}: PostsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className="w-full flex flex-col items-start justify-start gap-3">
        {posts.map((post, index) => (
          <PostItem
            key={post.id}
            post={post}
            separator={index !== posts.length - 1}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
