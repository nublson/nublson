import { Typography } from "@/components/typography";
import Hero from "@/sections/hero";
import PostsSection from "@/sections/posts";
import ProjectsSection from "@/sections/projects";
import { Fragment } from "react";

export default function Home() {
  return (
    <Fragment>
      <Hero
        title="Nubelson"
        bottom={
          <div className="w-full flex items-center justify-between">
            <Typography className="font-bold text-muted-foreground">
              Software Engineer & Content Creator
            </Typography>
            <Typography className="font-bold text-muted-foreground">
              📍 Lisbon
            </Typography>
          </div>
        }
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
