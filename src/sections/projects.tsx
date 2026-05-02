import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { cn } from "@/lib/utils";
import { PostMetadata } from "@/utils/formatter";
import Link from "next/link";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
  className?: string;
}

export default function ProjectsSection({
  title,
  href,
  id,
  posts,
  className,
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className={cn("w-full", className)}>
        {posts.map((post) => (
          <Link
            className="h-min"
            href={`/work/${post.slug}`}
            key={post.id}
            aria-label={`${post.title} — view project`}
          >
            <ProjectItem post={post} />
          </Link>
        ))}
      </div>
    </SectionWrapper>
  );
}
