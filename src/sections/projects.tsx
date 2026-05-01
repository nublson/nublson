import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
  postSize?: "sm" | "lg";
}

export default function ProjectsSection({
  title,
  href,
  id,
  postSize = "lg",
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className="w-full flex items-center justify-start flex-wrap gap-5">
        <ProjectItem size={postSize} />
        <ProjectItem size={postSize} />
        <ProjectItem size={postSize} />
      </div>
    </SectionWrapper>
  );
}
