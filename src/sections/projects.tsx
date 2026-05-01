import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";

interface ProjectsSectionProps {
  title: string;
  href?: string;
  id: string;
}

export default function ProjectsSection({
  title,
  href,
  id,
}: ProjectsSectionProps) {
  return (
    <SectionWrapper title={title} path={href} id={id}>
      <div className="w-full flex items-center justify-start gap-5">
        <ProjectItem />
        <ProjectItem />
        <ProjectItem />
      </div>
    </SectionWrapper>
  );
}
