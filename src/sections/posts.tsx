import { PostItem } from "@/components/post-item";
import { SectionWrapper } from "@/components/section-wrapper";

interface PostsSectionProps {
  title: string;
  href?: string;
  id: string;
}

export default function PostsSection({ title, href, id }: PostsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className="w-full flex flex-col items-start justify-start gap-3">
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem separator={false} />
      </div>
    </SectionWrapper>
  );
}
