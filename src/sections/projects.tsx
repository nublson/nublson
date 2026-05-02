import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
  postSize?: "sm" | "lg";
  posts: PostMetadata[];
}

export default function ProjectsSection({
  title,
  href,
  id,
  postSize = "lg",
  posts,
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className="w-full flex items-start justify-start flex-wrap gap-5">
        {posts.map((post) => (
          <ProjectItem key={post.id} post={post} size={postSize} />
        ))}
      </div>
    </SectionWrapper>
  );
}
