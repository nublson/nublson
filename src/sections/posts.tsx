import { PostItem } from "@/components/post-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";
import Link from "next/link";

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
          <Link href={`/blog/${post.slug}`} key={post.id} className="w-full">
            <PostItem post={post} separator={index !== posts.length - 1} />
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
