import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";
import { projectHref } from "@/utils/project-links";

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
        {posts.map((post) => {
          const link = projectHref(post);
          return (
            <li key={post.id} id={post.slug} className="scroll-mt-6">
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press block rounded-lg"
                >
                  <ProjectItem post={post} clampDescription external />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <ProjectItem post={post} clampDescription />
              )}
            </li>
          );
        })}
      </ul>
    </SectionWrapper>
  );
}
