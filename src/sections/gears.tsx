import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { cn } from "@/lib/utils";
import { PostMetadata } from "@/utils/formatter";

interface GearsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
  className?: string;
}

export default function GearsSection({
  title,
  href,
  id,
  posts,
  className,
}: GearsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className={cn("w-full", className)}>
        {posts.map((post) => (
          <a
            className="h-min"
            href={post.path}
            key={post.id}
            aria-label={`${post.title} — view gear item`}
          >
            <ProjectItem post={post} />
          </a>
        ))}
      </div>
    </SectionWrapper>
  );
}
