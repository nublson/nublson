import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";

interface GearsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
}

export default function GearsSection({
  title,
  href,
  id,
  posts,
}: GearsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <ul className="-mx-2.5 flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.id}>
            <a
              href={post.path}
              target="_blank"
              rel="noopener noreferrer"
              className="press block rounded-lg"
              aria-label={`${post.title} — view gear item`}
            >
              <ProjectItem post={post} />
            </a>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
