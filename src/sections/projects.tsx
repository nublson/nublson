import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";
import Link from "next/link";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
  posts: PostMetadata[];
}

export default function ProjectsSection({
  title,
  href,
  id,
  posts,
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <ul className="-mx-2.5 flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/projects/${post.slug}`}
              className="block rounded-lg"
              aria-label={`${post.title} — view project`}
            >
              <ProjectItem post={post} />
            </Link>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}
