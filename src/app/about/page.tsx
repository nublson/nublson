import ContentSection from "@/sections/content";
import Hero from "@/sections/hero";
import { Fragment } from "react";

export default function AboutPage() {
  return (
    <Fragment>
      <Hero
        title="About Me"
        description="With a rich background in the entertainment industry, I’ve spent years honing my skills in storytelling, production, and innovation. But today, my passion lies in blending creativity with purpose - finding new, impactful ways to connect ideas, spark conversation, and build meaningful projects that leave a lasting impression."
        thumbnail={{
          src: "https://avatar.vercel.sh/nublson",
          alt: "Nubelson Fernandes",
        }}
      />
      <ContentSection />
    </Fragment>
  );
}
