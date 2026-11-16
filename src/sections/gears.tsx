import { LinkHoverCard } from "@/components/link-hover-card";
import { LinkPreviewCardBody } from "@/components/link-preview";
import { ProjectItem } from "@/components/project-item";
import { SectionWrapper } from "@/components/section-wrapper";
import { PostMetadata } from "@/utils/formatter";
import Image from "next/image";

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
            <LinkHoverCard
              trigger={
                <a
                  href={post.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press block rounded-lg"
                  aria-label={`${post.title} — view gear item`}
                >
                  <ProjectItem post={post} clampDescription thumbnail />
                </a>
              }
            >
              <LinkPreviewCardBody
                href={post.path}
                title={post.title}
                description={post.description}
                image={post.thumbnail && <GearImage src={post.thumbnail} />}
              />
            </LinkHoverCard>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

/**
 * A gear's cover in the hover card. Covers are cut-out product shots, so the
 * whole product shows on a muted ground instead of being cropped to fill.
 */
function GearImage({ src }: { src: string }) {
  return (
    <span className="block border-b border-black/10 bg-muted dark:border-white/10">
      <Image
        src={src}
        alt=""
        width={512}
        height={256}
        sizes="256px"
        className="aspect-[2/1] w-full object-contain p-4"
      />
    </span>
  );
}
