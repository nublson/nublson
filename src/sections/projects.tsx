import { SectionHeader } from "@/components/section-header";

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
    <section
      id={id}
      className="w-full flex flex-col items-center justify-start gap-8"
    >
      <SectionHeader title={title} href={href} />
    </section>
  );
}
