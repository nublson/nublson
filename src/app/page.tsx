import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import ProjectsSection from "@/sections/projects";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <Hero
        title="Nubelson"
        role="Software Engineer & Content Creator"
        location="Lisbon"
        description="Hi there! I’m an adventurer based in New York, with a background in
          the entertainment industry. These days, I’m driven by a love for
          creativity and innovation, constantly exploring new ways to connect
          ideas and build something meaningful."
      />
      <ProjectsSection
        title="Latest Projects"
        href="/work"
        id="work"
        postSize="sm"
      />
      <PostsSection title="Latest Posts" href="/blog" id="blog" />
    </Fragment>
  );
}
