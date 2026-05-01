import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import ProjectsSection from "@/sections/projects";
import { Fragment } from "react";

export default function WorkPage() {
  return (
    <Fragment>
      <Hero
        title="My Work"
        description="With a background in the entertainment industry, I specialise in crafting unique, impactful projects that tell compelling stories and connect people in meaningful ways.  I thrive on exploring new ideas, pushing boundaries, and building solutions that not only engage but inspire."
      />
      <ProjectsSection title="Latest Projects" id="work" />
      <ContentSection />
    </Fragment>
  );
}
